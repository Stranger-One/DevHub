import mongoose, { Types } from "mongoose";
import { OTPModel } from "../models/otp.model.js";
import { PendingRegistrationModel } from "../models/pending-registration.model.js";
import { SessionModel } from "../models/session.model.js";
import { UserModel } from "../../users/user.model.js";
import { hashPassword } from "./password.service.js";
import { createOTP, verifyOTP } from "./otp.service.js";
import { sendOTPEmail } from "./email.service.js";
import { generateTokenPair, hashRefreshToken } from "./token.service.js";

interface RegisterInput {
  email: string;
  password: string;
}

interface CompleteRegistrationInput {
  email: string;
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

export class AuthServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "AuthServiceError";
  }
}

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const isDuplicateKeyError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === 11000;

const handleRegistrationError = (error: unknown): never => {
  if (isDuplicateKeyError(error)) {
    throw new AuthServiceError("Email or username is already registered", 409);
  }

  throw error;
};

export const registerWithEmail = async (
  input: RegisterInput,
): Promise<void> => {
  const email = normalizeEmail(input.email);

  const existingUser = await UserModel.exists({ email });

  if (existingUser) {
    throw new AuthServiceError(
      "An account with this email already exists",
      409,
    );
  }

  const existingPending = await PendingRegistrationModel.findOne({ email });

  if (existingPending && existingPending.expiresAt > new Date()) {
    throw new AuthServiceError(
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

};

export const resendRegistrationOTP = async (
  emailInput: string,
): Promise<void> => {
  const email = normalizeEmail(emailInput);

  const existingUser = await UserModel.exists({ email });

  if (existingUser) {
    throw new AuthServiceError("This email is already registered", 409);
  }

  const pendingRegistration = await PendingRegistrationModel.findOne({
    email,
    authProvider: "email",
    expiresAt: { $gt: new Date() },
  });

  if (!pendingRegistration) {
    throw new AuthServiceError(
      "No active registration found. Please register again.",
      404,
    );
  }

  const { code } = await createOTP(email, "email_verification");

  await sendOTPEmail(email, code, "email_verification");
};

export const completeEmailRegistration = async (
  input: CompleteRegistrationInput,
  device: DeviceInfo,
): Promise<RegistrationResult> => {
  const email = normalizeEmail(input.email);
  const dbSession = await mongoose.startSession();

  let otpValid = false;
  let registrationResult: RegistrationResult | null = null;

  try {
    await dbSession.withTransaction(async () => {
      const pendingRegistration = await PendingRegistrationModel.findOne({
        email,
        authProvider: "email",
        expiresAt: { $gt: new Date() },
      })
        .select("+passwordHash")
        .session(dbSession);

      if (!pendingRegistration) {
        throw new AuthServiceError(
          "Registration expired or not found. Please register again.",
          404,
        );
      }

      const existingUser = await UserModel.exists({
        $or: [{ email }, { username: input.username }],
      }).session(dbSession);

      if (existingUser) {
        throw new AuthServiceError(
          "Email or username is already registered",
          409,
        );
      }

      otpValid = await verifyOTP(
        email,
        "email_verification",
        input.otp,
        dbSession,
      );

      if (!otpValid) return;

      const [user] = await UserModel.create(
        [
          {
            email,
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
    throw new AuthServiceError("Invalid or expired OTP", 400);
  }

  if (!registrationResult) {
    throw new AuthServiceError("Registration could not be completed", 500);
  }

  return registrationResult;
};
