import { InferSchemaType, model, Schema } from "mongoose";

export const AUTH_PROVIDERS = ["email", "google", "github"] as const;

export type AuthProvider = (typeof AUTH_PROVIDERS)[number];

const pendingRegistrationSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    passwordHash: {
      type: String,
      select: false,
    },

    authProvider: {
      type: String,
      enum: AUTH_PROVIDERS,
      required: true,
    },

    providerId: {
      type: String,
      trim: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// One pending registration per normalized email.
pendingRegistrationSchema.index(
  { email: 1 },
  {
    unique: true,
    name: "uniq_pending_registration_email",
  },
);

// Prevent duplicate pending OAuth identities.
pendingRegistrationSchema.index(
  { authProvider: 1, providerId: 1 },
  {
    unique: true,
    name: "uniq_pending_oauth_identity",
    partialFilterExpression: {
      providerId: { $type: "string" },
    },
  },
);

// Automatically remove expired registrations.
pendingRegistrationSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
    name: "pending_registration_expiry_ttl",
  },
);

export type PendingRegistration = InferSchemaType<
  typeof pendingRegistrationSchema
>;

export const PendingRegistrationModel = model(
  "PendingRegistration",
  pendingRegistrationSchema,
);
