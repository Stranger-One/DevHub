import type { Types } from "mongoose";
import { UserRole } from "../users/user.model.js";
import { AuthProvider } from "./models/pending-registration.model.js";
import { OtpPurpose } from "./models/otp.model.js";

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
