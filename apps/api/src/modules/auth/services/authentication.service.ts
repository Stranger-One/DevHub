import { Types } from "mongoose";
import { timingSafeEqual } from "node:crypto";

import { UserModel } from "../../users/user.model.js";
import { SessionModel } from "../models/session.model.js";

import { verifyPassword } from "./password.service.js";
import {
  generateTokenPair,
  hashRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "./token.service.js";

import { ApiError } from "../../../errors/api-error.js";

interface LoginInput {
  email: string;
  password: string;
}

interface DeviceInfo {
  ip?: string;
  userAgent?: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const safeHashCompare = (storedHash: string, incomingHash: string): boolean => {
  const stored = Buffer.from(storedHash, "hex");
  const incoming = Buffer.from(incomingHash, "hex");

  if (stored.length !== incoming.length) return false;

  return timingSafeEqual(stored, incoming);
};

export const loginWithEmail = async (
  input: LoginInput,
  device: DeviceInfo,
): Promise<{ user: InstanceType<typeof UserModel>; tokens: AuthTokens }> => {
  const email = normalizeEmail(input.email);

  const user = await UserModel.findOne({ email }).select("+passwordHash");

  if (!user || !user.passwordHash) {
    throw new ApiError("Invalid email or password", 401, {
      code: "AUTH_INVALID_CREDENTIALS",
    });
  }

  const isPasswordValid = await verifyPassword(
    input.password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw new ApiError("Invalid email or password", 401, {
      code: "AUTH_INVALID_CREDENTIALS",
    });
  }

  if (!user.emailVerified) {
    throw new ApiError("Please verify your email before logging in", 403);
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
      code: "AUTH_INVALID_REFRESH_TOKEN",
    });
  }

  if (
    !Types.ObjectId.isValid(payload.sub) ||
    !Types.ObjectId.isValid(payload.sid)
  ) {
    throw new ApiError("Invalid refresh token", 401, {
      code: "AUTH_INVALID_REFRESH_TOKEN",
    });
  }

  const session = await SessionModel.findOne({
    _id: payload.sid,
    userId: payload.sub,
  }).select("+refreshTokenHash");

  if (!session || session.status !== "active") {
    throw new ApiError("Session is no longer active", 401, {
      code: "AUTH_SESSION_INACTIVE",
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
      code: "AUTH_SESSION_EXPIRED",
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
      code: "AUTH_INVALID_ACCESS_TOKEN",
    });
  }

  if (
    !Types.ObjectId.isValid(payload.sub) ||
    !Types.ObjectId.isValid(payload.sid)
  ) {
    throw new ApiError("Invalid access token", 401, {
      code: "AUTH_INVALID_ACCESS_TOKEN",
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
      code: "USER_NOT_FOUND",
    });
  }

  return user;
};
