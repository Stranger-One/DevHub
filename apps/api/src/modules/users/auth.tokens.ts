import { createHash, randomBytes, randomUUID } from "node:crypto";
import jwt, { type SignOptions } from "jsonwebtoken";
import { UserRole } from "./user.model.js";

const ISSUER = "devhub-api";
const AUDIENCE = "devhub-web";

function getAccessSecret(): string {
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("ACCESS_TOKEN_SECRET must contain at least 32 characters");
  }

  return secret;
}

export interface AccessTokenPayload {
  sub: string;
  role: UserRole;
}

export function createAccessToken(user: AccessTokenPayload): string {
  const expiresIn = (process.env.ACCESS_TOKEN_TTL ??
    "15m") as NonNullable<SignOptions["expiresIn"]>;

  return jwt.sign({ role: user.role }, getAccessSecret(), {
    subject: user.sub,
    issuer: ISSUER,
    audience: AUDIENCE,
    expiresIn,
    algorithm: "HS256",
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, getAccessSecret(), {
    issuer: ISSUER,
    audience: AUDIENCE,
    algorithms: ["HS256"],
  });
}

export function createRefreshToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashRefreshToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createTokenFamilyId(): string {
  return randomUUID();
}

export function getRefreshExpiry(): Date {
  const days = Number(process.env.REFRESH_TOKEN_DAYS ?? 7);

  if (!Number.isInteger(days) || days < 1 || days > 90) {
    throw new Error("REFRESH_TOKEN_DAYS must be an integer between 1 and 90");
  }

  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}
