import { InferSchemaType, model, Schema } from "mongoose";

export const SESSION_STATUSES = ["active", "revoked"] as const;

export type SessionStatus = (typeof SESSION_STATUSES)[number];

const deviceSchema = new Schema(
  {
    userAgent: {
      type: String,
      trim: true,
    },

    ip: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Current refresh token hash.
    refreshTokenHash: {
      type: String,
      required: true,
      select: false,
    },

    // Incremented whenever a refresh token is rotated.
    tokenVersion: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: SESSION_STATUSES,
      default: "active",
      required: true,
    },

    device: {
      type: deviceSchema,
      default: {},
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    lastUsedAt: {
      type: Date,
      default: Date.now,
    },

    revokedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Efficiently retrieve active sessions for a user.
sessionSchema.index(
  { userId: 1, status: 1 },
  { name: "sessions_by_user_status" },
);

// Efficient expiry queries.
sessionSchema.index({ expiresAt: 1 }, { name: "sessions_by_expiry" });

export type Session = InferSchemaType<typeof sessionSchema>;

export const SessionModel = model("Session", sessionSchema);
