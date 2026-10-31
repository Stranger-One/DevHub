import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import type { ClientSession } from "mongoose";
import { OTPModel } from "../models/otp.model.js";
import type { OtpPurpose } from "../models/otp.model.js";

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 60;
const OTP_MAX_ATTEMPTS = 5;

const getOTPSecret = (): string => {
  const secret = process.env.OTP_HASH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("OTP_HASH_SECRET must be at least 32 characters");
  }

  return secret;
};

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const hashOTP = (email: string, purpose: OtpPurpose, code: string): string => {
  return createHmac("sha256", getOTPSecret())
    .update(`${normalizeEmail(email)}:${purpose}:${code}`)
    .digest("hex");
};

const compareHashes = (storedHash: string, incomingHash: string): boolean => {
  const stored = Buffer.from(storedHash, "hex");
  const incoming = Buffer.from(incomingHash, "hex");

  if (stored.length !== incoming.length) return false;

  return timingSafeEqual(stored, incoming);
};

export const createOTP = async (
  email: string,
  purpose: OtpPurpose,
): Promise<{ code: string; expiresAt: Date }> => {
  const normalizedEmail = normalizeEmail(email);
  const now = new Date();

  const cooldownStart = new Date(
    now.getTime() - OTP_RESEND_COOLDOWN_SECONDS * 1000,
  );

  const recentOTP = await OTPModel.findOne({
    email: normalizedEmail,
    purpose,
    createdAt: { $gt: cooldownStart },
  }).sort({ createdAt: -1 });

  if (recentOTP) {
    throw new Error("Please wait before requesting another OTP");
  }

  await OTPModel.updateMany(
    {
      email: normalizedEmail,
      purpose,
      consumedAt: null,
    },
    {
      $set: { consumedAt: now },
    },
  );

  const code = randomInt(0, 10 ** OTP_LENGTH)
    .toString()
    .padStart(OTP_LENGTH, "0");

  const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await OTPModel.create({
    email: normalizedEmail,
    purpose,
    codeHash: hashOTP(normalizedEmail, purpose, code),
    attempts: 0,
    expiresAt,
  });

  return { code, expiresAt };
};

export const verifyOTP = async (
  email: string,
  purpose: OtpPurpose,
  code: string,
  dbSession?: ClientSession,
): Promise<boolean> => {
  const normalizedEmail = normalizeEmail(email);
  const now = new Date();

  let query = OTPModel.findOne({
    email: normalizedEmail,
    purpose,
    consumedAt: null,
  }).sort({ createdAt: -1 });

  if (dbSession) {
    query = query.session(dbSession);
  }

  const otp = await query.select("+codeHash");

  if (!otp || otp.expiresAt <= now || otp.attempts >= OTP_MAX_ATTEMPTS) {
    return false;
  }

  const incomingHash = hashOTP(normalizedEmail, purpose, code);
  const isValid = compareHashes(otp.codeHash, incomingHash);

  if (!isValid) {
    const updateQuery = OTPModel.updateOne(
      {
        _id: otp._id,
        attempts: otp.attempts,
        consumedAt: null,
        expiresAt: { $gt: now },
      },
      {
        $inc: { attempts: 1 },
      },
    );

    if (dbSession) {
      await updateQuery.session(dbSession);
    } else {
      await updateQuery;
    }

    return false;
  }

  let consumeQuery = OTPModel.findOneAndUpdate(
    {
      _id: otp._id,
      attempts: { $lt: OTP_MAX_ATTEMPTS },
      consumedAt: null,
      expiresAt: { $gt: now },
    },
    {
      $set: { consumedAt: now },
    },
    { returnDocument: "after" },
  );

  if (dbSession) {
    consumeQuery = consumeQuery.session(dbSession);
  }

  const consumedOTP = await consumeQuery;

  return Boolean(consumedOTP);
};

export const invalidateOTPs = async (
  email: string,
  purpose: OtpPurpose,
  dbSession?: ClientSession,
): Promise<void> => {
  const query = OTPModel.updateMany(
    {
      email: normalizeEmail(email),
      purpose,
      consumedAt: null,
    },
    {
      $set: { consumedAt: new Date() },
    },
  );

  if (dbSession) {
    await query.session(dbSession);
  } else {
    await query;
  }
};
