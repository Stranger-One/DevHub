import mongoose, { Types } from "mongoose";
import { PendingRegistrationModel } from "../models/pending-registration.model.js";
import { SessionModel } from "../models/session.model.js";
import { UserModel } from "../../users/user.model.js";
import { hashPassword } from "./password.service.js";
import { createOTP, verifyOTP } from "./otp.service.js";
import { sendOTPEmail } from "./email.service.js";
import { generateTokenPair, hashRefreshToken } from "./token.service.js";
import { ApiError } from "../../../errors/api-error.js";
import { ErrorCode } from "../../../errors/error-code.js";

interface RegisterInput {
  email: string;
  password: string;
}

interface CompleteRegistrationInput {
  id: string;
  otp: string;
  username: string;
  role: "developer" | "client";
}

interface DeviceInfo {
  ip?: string;
  userAgent?: string;
}

interface RegistrationResult {
  user: InstanceType<typeof UserModel>;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const isDuplicateKeyError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === 11000;

const getDuplicateField = (error: unknown): "email" | "username" | null => {
  if (
    typeof error !== "object" ||
    error === null ||
    !("keyValue" in error) ||
    typeof error.keyValue !== "object" ||
    error.keyValue === null
  ) {
    return null;
  }

  const fields = Object.keys(error.keyValue);

  if (fields.includes("email")) return "email";
  if (fields.includes("username")) return "username";

  return null;
};

const duplicateAccountError = (field: "email" | "username"): ApiError =>
  new ApiError(
    field === "email"
      ? "An account with this email already exists"
      : "This username is already taken",
    409,
    {
      code: ErrorCode.RESOURCE_CONFLICT,
      description:
        field === "email"
          ? "Use a different email address or sign in to the existing account."
          : "Choose a different username for your account.",
    },
  );

const handleRegistrationError = (error: unknown): never => {
  if (isDuplicateKeyError(error)) {
    const duplicateField = getDuplicateField(error);

    if (duplicateField) throw duplicateAccountError(duplicateField);

    throw new ApiError("Account details are already in use", 409, {
      code: ErrorCode.RESOURCE_CONFLICT,
      description:
        "The email or username is already associated with an account.",
    });
  }

  throw error;
};

export const registerWithEmail = async (input: RegisterInput) => {
  const email = normalizeEmail(input.email);

  const existingUser = await UserModel.exists({ email });

  if (existingUser) {
    throw duplicateAccountError("email");
  }

  const existingPending = await PendingRegistrationModel.findOne({ email });

  if (existingPending) {
    const hashNewPassword = await hashPassword(input.password);
    existingPending.passwordHash = hashNewPassword;
    await existingPending.save();

    const { code } = await createOTP(email, "email_verification");
    await sendOTPEmail(email, code, "email_verification");

    return existingPending?._id;
  }

  const passwordHash = await hashPassword(input.password);

  let pendingRegistration;
  try {
    pendingRegistration = await PendingRegistrationModel.create({
      email,
      passwordHash,
      authProvider: "email",
      providerId: email,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });
  } catch (error) {
    handleRegistrationError(error);
  }

  const { code } = await createOTP(email, "email_verification");

  await sendOTPEmail(email, code, "email_verification");
  return pendingRegistration?._id;
};

export const resendRegistrationOTP = async (id: string): Promise<void> => {
  const existingUser = await UserModel.exists({ _id: id });

  if (existingUser) {
    throw new ApiError("This email is already registered", 409, {
      code: ErrorCode.RESOURCE_CONFLICT,
    });
  }

  const pendingRegistration = await PendingRegistrationModel.findOne({
    _id: id,
    authProvider: "email",
    expiresAt: { $gt: new Date() },
  });

  if (!pendingRegistration) {
    throw new ApiError(
      "No active registration found. Please register again.",
      404,
      { code: ErrorCode.RESOURCE_NOT_FOUND },
    );
  }

  const { code } = await createOTP(
    pendingRegistration.email,
    "email_verification",
  );

  await sendOTPEmail(pendingRegistration.email, code, "email_verification");
};

export const completeEmailRegistration = async (
  input: CompleteRegistrationInput,
  device: DeviceInfo,
): Promise<RegistrationResult> => {
  const dbSession = await mongoose.startSession();

  let otpValid = false;
  let registrationResult: RegistrationResult | null = null;

  try {
    await dbSession.withTransaction(async () => {
      const pendingRegistration = await PendingRegistrationModel.findOne({
        _id: input.id,
        authProvider: "email",
        expiresAt: { $gt: new Date() },
      })
        .select("+passwordHash")
        .session(dbSession);

      if (!pendingRegistration) {
        throw new ApiError(
          "Registration expired or not found. Please register again.",
          404,
          { code: ErrorCode.RESOURCE_NOT_FOUND },
        );
      }

      const existingEmail = await UserModel.exists({
        email: pendingRegistration.email,
      }).session(dbSession);

      if (existingEmail) throw duplicateAccountError("email");

      const existingUsername = await UserModel.exists({
        username: input.username,
      }).session(dbSession);

      if (existingUsername) throw duplicateAccountError("username");

      otpValid = await verifyOTP(
        pendingRegistration.email,
        "email_verification",
        input.otp,
        dbSession,
      );

      if (!otpValid) return;

      const [user] = await UserModel.create(
        [
          {
            email: pendingRegistration.email,
            username: input.username,
            passwordHash: pendingRegistration.passwordHash,
            role: input.role,
            emailVerified: true,
            authProviders: [
              {
                provider: "email",
                providerId: pendingRegistration.email,
              }
            ],
          },
        ],
        { session: dbSession },
      );

      const sessionId = new Types.ObjectId();
      const tokenVersion = 0;

      const tokens = generateTokenPair(
        user._id.toString(),
        sessionId.toString(),
        tokenVersion,
      );

      await SessionModel.create(
        [
          {
            _id: sessionId,
            userId: user._id,
            refreshTokenHash: hashRefreshToken(tokens.refreshToken),
            tokenVersion,
            status: "active",
            device: {
              ip: device.ip,
              userAgent: device.userAgent,
            },
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            lastUsedAt: new Date(),
          },
        ],
        { session: dbSession },
      );

      await PendingRegistrationModel.deleteOne(
        { _id: pendingRegistration._id },
        { session: dbSession },
      );

      registrationResult = { user, tokens };
    });
  } catch (error) {
    handleRegistrationError(error);
  } finally {
    await dbSession.endSession();
  }

  if (!otpValid) {
    throw new ApiError("Invalid or expired OTP", 400, {
      code: ErrorCode.OTP_ERROR,
    });
  }

  if (!registrationResult) {
    throw new ApiError("Registration could not be completed", 500, {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
    });
  }

  return registrationResult;
};
