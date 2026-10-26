import { Schema, model, Types, type HydratedDocument } from "mongoose";

export type RefreshTokenStatus = "active" | "rotated" | "revoked";

export interface IRefreshSession {
  userId: Types.ObjectId;
  familyId: string;
  tokenHash: string;
  status: RefreshTokenStatus;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type RefreshSessionDocument = HydratedDocument<IRefreshSession>;

const refreshSessionSchema = new Schema<IRefreshSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    familyId: {
      type: String,
      required: true,
      index: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["active", "rotated", "revoked"],
      default: "active",
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

refreshSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

refreshSessionSchema.index({
  familyId: 1,
  status: 1,
});

export const RefreshSession = model<IRefreshSession>(
  "RefreshSession",
  refreshSessionSchema,
);
