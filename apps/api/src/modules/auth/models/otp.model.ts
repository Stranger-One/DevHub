import { InferSchemaType, model, Schema } from "mongoose";

export const OTP_PURPOSES = [
  "email_verification",
  "password_reset",
  "email_change",
  "two_factor",
] as const;

export type OtpPurpose = (typeof OTP_PURPOSES)[number];

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    purpose: {
      type: String,
      enum: OTP_PURPOSES,
      required: true,
    },

    codeHash: {
      type: String,
      required: true,
      select: false,
    },

    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    consumedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Find the latest OTP for an email and purpose.
otpSchema.index(
  { email: 1, purpose: 1, createdAt: -1 },
  { name: "otp_email_purpose_created" },
);

// Automatically delete expired OTP documents.
otpSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, name: "otp_expiry_ttl" },
);

export type OTP = InferSchemaType<typeof otpSchema>;

export const OTPModel = model("OTP", otpSchema);
