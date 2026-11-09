import type { Types } from "mongoose";
import { UserModel, UserRole } from "../users/user.model.js";
import { AuthProvider } from "./models/pending-registration.model.js";
import { OtpPurpose } from "../otp/otp.model.js";

export interface TokenPayload {
  sub: string;
  sid: string;
  ver: number;
  jti?: string;
}

export interface AuthenticatedUser {
  userId: string;
  sessionId: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface OTPResult {
  code: string;
  expiresAt: Date;
}

export interface CreateOTPOptions {
  email: string;
  purpose: OtpPurpose;
}

export interface CreateSessionOptions {
  userId: Types.ObjectId;
  refreshTokenHash: string;
  expiresAt: Date;
  userAgent?: string;
  ip?: string;
}

export interface OAuthIdentity {
  provider: Exclude<AuthProvider, "email">;
  providerId: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  avatarUrl?: string;
}


export interface RegisterInput {
  email: string;
  password: string;
}

export interface CompleteRegistrationInput {
  id: string;
  otp: string;
  username: string;
  role: "developer" | "client";
}

export interface DeviceInfo {
  ip?: string;
  userAgent?: string;
}

export interface RegistrationResult {
  user: InstanceType<typeof UserModel>;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
export interface LoginInput {
  email: string;
  password: string;
}

export interface DeviceInfo {
  ip?: string;
  userAgent?: string;
}

