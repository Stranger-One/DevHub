import mongoose, { Types } from "mongoose";
import { OTPModel } from "../models/otp.model.js";
import { PendingRegistrationModel } from "../models/pending-registration.model.js";
import { SessionModel } from "../models/session.model.js";
import { UserModel } from "../../users/user.model.js";
import { hashPassword } from "./password.service.js";
import { createOTP, verifyOTP } from "./otp.service.js";
import { sendOTPEmail } from "./email.service.js";
import { generateTokenPair, hashRefreshToken } from "./token.service.js";
import { ApiError } from "../../../errors/api-error.js";

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

const handleRegistrationError = (error: unknown): never => {
  if (isDuplicateKeyError(error)) {
    throw new ApiError("Email or username is already registered", 409, {
      code: "AUTH_CONFLICT",
    });
  }

  throw error;
};

export const registerWithEmail = async (input: RegisterInput) => {
  const email = normalizeEmail(input.email);

  const existingUser = await UserModel.exists({ email });

  if (existingUser) {
    throw new ApiError("An account with this email already exists", 409);
  }

  const existingPending = await PendingRegistrationModel.findOne({ email });

  if (existingPending && existingPending.expiresAt > new Date()) {
    throw new ApiError(
      "Registration already started. Please verify your email or request a new OTP.",
      409,
    );
  }

  if (existingPending) {
    await PendingRegistrationModel.deleteOne({ _id: existingPending._id });
  }

  const passwordHash = await hashPassword(input.password);

  let pendingRegistration;
  try {
    pendingRegistration = await PendingRegistrationModel.create({
      email,
      passwordHash,
      authProvider: "email",
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
      code: "AUTH_CONFLICT",
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
        );
      }

      const existingUser = await UserModel.exists({
        $or: [
          { email: pendingRegistration.email },
          { username: input.username },
        ],
      }).session(dbSession);

      if (existingUser) {
        throw new ApiError("Email or username is already registered", 409);
      }

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
            authProviders: [],
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
      code: "AUTH_INVALID_OTP",
    });
  }

  if (!registrationResult) {
    throw new ApiError("Registration could not be completed", 500, {
      code: "AUTH_REGISTRATION_FAILED",
    });
  }

  return registrationResult;
};
