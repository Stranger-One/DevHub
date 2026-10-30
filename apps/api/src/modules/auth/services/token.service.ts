import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { createHmac, randomUUID } from "node:crypto";
import type { AuthTokens, TokenPayload } from "../auth.types.js";

const getAccessSecret = (): string => {
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("ACCESS_TOKEN_SECRET must be at least 32 characters");
  }

  return secret;
};

const getRefreshSecret = (): string => {
  const secret = process.env.REFRESH_TOKEN_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("REFRESH_TOKEN_SECRET must be at least 32 characters");
  }

  return secret;
};

const getHashSecret = (): string => {
  const secret = process.env.REFRESH_TOKEN_HASH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("REFRESH_TOKEN_HASH_SECRET must be at least 32 characters");
  }

  return secret;
};

const signToken = (
  payload: TokenPayload,
  secret: string,
  expiresIn: SignOptions["expiresIn"],
): string => {
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  });
};

export const generateTokenPair = (
  userId: string,
  sessionId: string,
  tokenVersion: number,
): AuthTokens => {
  const payload: TokenPayload = {
    sub: userId,
    sid: sessionId,
    ver: tokenVersion,
  };

  const accessToken = signToken(
    {
      ...payload,
      jti: randomUUID(),
    },
    getAccessSecret(),
    "15m",
  );

  const refreshToken = signToken(
    {
      ...payload,
      jti: randomUUID(),
    },
    getRefreshSecret(),
    "7d",
  );

  return {
    accessToken,
    refreshToken,
  };
};

const decodeToken = (token: string, secret: string): TokenPayload => {
  const decoded = jwt.verify(token, secret, {
    algorithms: ["HS256"],
  }) as JwtPayload;

  if (
    typeof decoded.sub !== "string" ||
    typeof decoded.sid !== "string" ||
    typeof decoded.ver !== "number" ||
    typeof decoded.jti !== "string"
  ) {
    throw new Error("INVALID_TOKEN_PAYLOAD");
  }

  return {
    sub: decoded.sub,
    sid: decoded.sid,
    ver: decoded.ver,
    jti: decoded.jti,
  };
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return decodeToken(token, getAccessSecret());
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return decodeToken(token, getRefreshSecret());
};

export const hashRefreshToken = (token: string): string => {
  return createHmac("sha256", getHashSecret()).update(token).digest("hex");
};
