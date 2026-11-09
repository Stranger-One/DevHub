import mongoose, { Types } from "mongoose";
import { timingSafeEqual } from "node:crypto";
import { UserModel } from "../users/user.model.js";
import { ApiError } from "../../errors/api-error.js";
import { ErrorCode } from "../../errors/error-code.js";
import { SessionModel } from "./models/session.model.js";
import { CompleteRegistrationInput, LoginInput, RegisterInput, ResetPasswordInput } from "./auth.validation.js";
import { createOTP, verifyOTP } from "../otp/otp.service.js";
import { hashPassword, verifyPassword } from "./utils/password.service.js";
import { sendOTPEmail } from "../integrations/email/email.service.js";
import { PendingRegistrationModel } from "./models/pending-registration.model.js";
import {
  generateTokenPair,
  hashRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "./utils/token.service.js";
import { AuthTokens, DeviceInfo, RegistrationResult } from "./auth.types.js";


const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

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

const safeHashCompare = (storedHash: string, incomingHash: string): boolean => {
  const stored = Buffer.from(storedHash, "hex");
  const incoming = Buffer.from(incomingHash, "hex");

  if (stored.length !== incoming.length) return false;

  return timingSafeEqual(stored, incoming);
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
              },
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

export const loginWithEmail = async (
  input: LoginInput,
  device: DeviceInfo,
): Promise<{ user: InstanceType<typeof UserModel>; tokens: AuthTokens }> => {
  const email = normalizeEmail(input.email);

  const user = await UserModel.findOne({ email }).select("+passwordHash");

  if (!user || !user.passwordHash) {
    throw new ApiError("Invalid email or password", 401, {
      code: ErrorCode.AUTHENTICATION_ERROR,
    });
  }

  const isPasswordValid = await verifyPassword(
    input.password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw new ApiError("Invalid email or password", 401, {
      code: ErrorCode.AUTHENTICATION_ERROR,
    });
  }

  if (!user.emailVerified) {
    throw new ApiError("Please verify your email before logging in", 403, {
      code: ErrorCode.AUTHENTICATION_ERROR,
      description: "Verify your email address before signing in.",
    });
  }

  const sessionId = new Types.ObjectId();
  const tokenVersion = 0;

  const tokens = generateTokenPair(
    user._id.toString(),
    sessionId.toString(),
    tokenVersion,
  );

  await SessionModel.create({
    _id: sessionId,
    userId: user._id,
    refreshTokenHash: hashRefreshToken(tokens.refreshToken),
    tokenVersion,
    status: "active",
    device: {
      ip: device.ip,
      userAgent: device.userAgent,
    },
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
    lastUsedAt: new Date(),
  });

  return { user, tokens };
};

export const refreshSession = async (
  refreshToken: string,
): Promise<AuthTokens> => {
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError("Invalid or expired refresh token", 401, {
      code: ErrorCode.TOKEN_ERROR,
    });
  }

  if (
    !Types.ObjectId.isValid(payload.sub) ||
    !Types.ObjectId.isValid(payload.sid)
  ) {
    throw new ApiError("Invalid refresh token", 401, {
      code: ErrorCode.TOKEN_ERROR,
    });
  }

  const session = await SessionModel.findOne({
    _id: payload.sid,
    userId: payload.sub,
  }).select("+refreshTokenHash");

  if (!session || session.status !== "active") {
    throw new ApiError("Session is no longer active", 401, {
      code: ErrorCode.SESSION_ERROR,
    });
  }

  if (session.expiresAt <= new Date()) {
    await SessionModel.updateOne(
      { _id: session._id, status: "active" },
      {
        $set: {
          status: "revoked",
          revokedAt: new Date(),
        },
      },
    );

    throw new ApiError("Session has expired", 401, {
      code: ErrorCode.SESSION_ERROR,
    });
  }

  const incomingHash = hashRefreshToken(refreshToken);

  const isCurrentToken = safeHashCompare(
    session.refreshTokenHash,
    incomingHash,
  );

  if (!isCurrentToken || session.tokenVersion !== payload.ver) {
    await SessionModel.updateOne(
      { _id: session._id, status: "active" },
      {
        $set: {
          status: "revoked",
          revokedAt: new Date(),
        },
      },
    );

    throw new ApiError(
      "Refresh token reuse detected. Please log in again.",
      401,
      { code: ErrorCode.SESSION_ERROR },
    );
  }

  const nextVersion = session.tokenVersion + 1;

  const tokens = generateTokenPair(payload.sub, payload.sid, nextVersion);

  const updatedSession = await SessionModel.findOneAndUpdate(
    {
      _id: session._id,
      userId: payload.sub,
      status: "active",
      tokenVersion: payload.ver,
      refreshTokenHash: session.refreshTokenHash,
      expiresAt: { $gt: new Date() },
    },
    {
      $set: {
        refreshTokenHash: hashRefreshToken(tokens.refreshToken),
        tokenVersion: nextVersion,
        lastUsedAt: new Date(),
        expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
      },
    },
    { returnDocument: "after" },
  );

  if (!updatedSession) {
    await SessionModel.updateOne(
      { _id: session._id, status: "active" },
      {
        $set: {
          status: "revoked",
          revokedAt: new Date(),
        },
      },
    );

    throw new ApiError(
      "Refresh token is no longer valid. Please log in again.",
      401,
      { code: ErrorCode.SESSION_ERROR },
    );
  }

  return tokens;
};

export const logoutSession = async (refreshToken?: string): Promise<void> => {
  if (!refreshToken) return;

  try {
    const payload = verifyRefreshToken(refreshToken);

    if (
      !Types.ObjectId.isValid(payload.sub) ||
      !Types.ObjectId.isValid(payload.sid)
    ) {
      return;
    }

    await SessionModel.updateOne(
      {
        _id: payload.sid,
        userId: payload.sub,
        status: "active",
      },
      {
        $set: {
          status: "revoked",
          revokedAt: new Date(),
        },
      },
    );
  } catch {
    // Invalid or expired cookies are still cleared by the controller.
  }
};

export const logoutAllSessions = async (userId: string): Promise<void> => {
  await SessionModel.updateMany(
    {
      userId,
      status: "active",
    },
    {
      $set: {
        status: "revoked",
        revokedAt: new Date(),
      },
    },
  );
};

export const authenticateAccessToken = async (
  accessToken: string,
): Promise<{ userId: string; sessionId: string; tokenVersion: number }> => {
  let payload;

  try {
    payload = verifyAccessToken(accessToken);
  } catch {
    throw new ApiError("Invalid or expired access token", 401, {
      code: ErrorCode.TOKEN_ERROR,
    });
  }

  if (
    !Types.ObjectId.isValid(payload.sub) ||
    !Types.ObjectId.isValid(payload.sid)
  ) {
    throw new ApiError("Invalid access token", 401, {
      code: ErrorCode.TOKEN_ERROR,
    });
  }

  const session = await SessionModel.findOne({
    _id: payload.sid,
    userId: payload.sub,
    status: "active",
    tokenVersion: payload.ver,
    expiresAt: { $gt: new Date() },
  });

  if (!session) {
    throw new ApiError(
      "Session is no longer active. Please log in again.",
      401,
      { code: ErrorCode.SESSION_ERROR },
    );
  }

  return {
    userId: payload.sub,
    sessionId: payload.sid,
    tokenVersion: payload.ver,
  };
};

export const getAuthenticatedUser = async (userId: string) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new ApiError("User not found", 404, {
      code: ErrorCode.RESOURCE_NOT_FOUND,
    });
  }

  return user;
};

export const sendForgotPasswordOtp = async (email: string) => {
  const normalizedEmail = normalizeEmail(email);

  if (!email) {
    throw new ApiError("Email is required", 400, {
      code: ErrorCode.VALIDATION_ERROR,
      description: "Email is required to send a password reset OTP",
    });
  }

  const user = await UserModel.findOne({ email: normalizedEmail });

  if (!user) {
    throw new ApiError("User not found", 404, {
      code: ErrorCode.RESOURCE_NOT_FOUND,
      description: "No user found with the provided email",
    });
  }

  const { code } = await createOTP(email, "forgot_password");

  await sendOTPEmail(email, code, "forgot_password");

  return user._id;
};

export const verifyResetPassword = async (
  input: ResetPasswordInput,
): Promise<void> => {
  const user = await UserModel.findById(input.id);
  if (!user) {
    throw new ApiError("User not found", 404, {
      code: ErrorCode.RESOURCE_NOT_FOUND,
      description: "No user found with the provided ID",
    });
  }

  // Verify the OTP
  const isOtpValid = await verifyOTP(user.email, "forgot_password", input.otp);

  if (!isOtpValid) {
    throw new ApiError("Invalid or expired OTP", 400, {
      code: ErrorCode.OTP_ERROR,
      description: "The provided OTP is invalid or has expired",
    });
  }

  // Update the user's password
  user.passwordHash = await hashPassword(input.newPassword);
  await user.save();
};
