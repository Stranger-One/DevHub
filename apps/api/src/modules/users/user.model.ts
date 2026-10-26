import { InferSchemaType, model, Schema } from "mongoose";

export type UserRole = "DEVELOPER" | "CLIENT";

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

    // Optional to support accounts that authenticate through OAuth later.
    passwordHash: {
      type: String,
      select: false,
    },

    role: {
      type: String,
      enum: ["DEVELOPER", "CLIENT"],
      required: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    profile: {
      displayName: {
        type: String,
        trim: true,
        maxlength: 80,
      },
      bio: {
        type: String,
        trim: true,
        maxlength: 500,
      },
      avatarUrl: {
        type: String,
        trim: true,
      },
      location: {
        type: String,
        trim: true,
        maxlength: 100,
      },
      skills: {
        type: [String],
        default: [],
      },
      website: {
        type: String,
        trim: true,
      },
      githubUrl: {
        type: String,
        trim: true,
      },
      linkedinUrl: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// MongoDB enforces uniqueness, including when requests arrive concurrently.
userSchema.index({ email: 1 }, { unique: true, name: "uniq_users_email" });

userSchema.index(
  { username: 1 },
  { unique: true, name: "uniq_users_username" },
);

export type User = InferSchemaType<typeof userSchema>;

export const UserModel = model("User", userSchema);
