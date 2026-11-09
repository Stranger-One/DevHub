import { InferSchemaType, model, Schema } from "mongoose";

export const USER_ROLES = ["developer", "client"] as const;
export const ACCOUNT_STATUS = ["active", "suspended", "deleted"] as const;
export const SOCIAL_PROVIDERS = ["email", "google", "github"] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type AccountStatus = (typeof ACCOUNT_STATUS)[number];
export type SocialProvider = (typeof SOCIAL_PROVIDERS)[number];



// Connected OAuth identities
const authProviderSchema = new Schema(
  {
    provider: {
      type: String,
      enum: SOCIAL_PROVIDERS,
      required: true,
    },

    providerId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-z0-9_]+$/,
    },

    passwordHash: {
      type: String,
      select: false,
    },

    role: {
      type: String,
      enum: USER_ROLES,
      required: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    accountStatus:{
      type: String,
      enum: ACCOUNT_STATUS,
      default: "active",
    },

    authProviders: {
      type: [authProviderSchema],
      default: [],
    }
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Unique normalized email
userSchema.index(
  { email: 1 },
  {
    unique: true,
    name: "uniq_users_email",
  },
);

// Unique username
userSchema.index(
  { username: 1 },
  {
    unique: true,
    name: "uniq_users_username",
  },
);

// Prevent the same OAuth identity from being linked
// to multiple user accounts.
userSchema.index(
  {
    "authProviders.provider": 1,
    "authProviders.providerId": 1,
  },
  {
    unique: true,
    name: "uniq_user_oauth_identity",
    partialFilterExpression: {
      "authProviders.providerId": { $type: "string" },
    },
  },
);

export type User = InferSchemaType<typeof userSchema>;

export const UserModel = model("User", userSchema);
