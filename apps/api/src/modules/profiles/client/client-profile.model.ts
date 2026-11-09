import {
  HydratedDocument,
  InferSchemaType,
  model,
  models,
  Schema,
} from "mongoose";

import {
  CLIENT_TYPES,
  CLIENT_VERIFICATION_STATUSES,
  ONBOARDING_STATUSES,
  PROFILE_VISIBILITIES,
} from "../profile.types.js";

// Reusable media schema
const mediaAssetSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

// Structured location
const locationSchema = new Schema(
  {
    country: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    state: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    city: {
      type: String,
      trim: true,
      maxlength: 100,
    },
  },
  { _id: false },
);

// Onboarding state
const onboardingSchema = new Schema(
  {
    status: {
      type: String,
      enum: ONBOARDING_STATUSES,
      default: "in_progress",
      required: true,
    },
    currentStep: {
      type: String,
      trim: true,
      default: "basic-information",
    },
  },
  { _id: false },
);

// Main ClientProfile schema
const clientProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    clientType: {
      type: String,
      enum: CLIENT_TYPES,
      required: true,
    },

    personalInformation: {
      displayName: {
        type: String,
        trim: true,
        maxlength: 80,
      },
      bio: {
        type: String,
        trim: true,
        maxlength: 1000,
      },
      avatar: {
        type: mediaAssetSchema,
        default: undefined,
      },
    },

    businessInformation: {
      companyName: {
        type: String,
        trim: true,
        maxlength: 150,
      },
      description: {
        type: String,
        trim: true,
        maxlength: 2000,
      },
      industry: {
        type: String,
        trim: true,
        maxlength: 100,
      },
      companySize: {
        type: String,
        enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
      },
      website: {
        type: String,
        trim: true,
        maxlength: 300,
      },
      logo: {
        type: mediaAssetSchema,
        default: undefined,
      },
    },

    location: {
      type: locationSchema,
      default: () => ({}),
    },

    contactInformation: {
      businessEmail: {
        type: String,
        lowercase: true,
        trim: true,
        maxlength: 254,
      },
      phone: {
        type: String,
        trim: true,
        maxlength: 30,
      },
    },

    hiringPreferences: {
      hiringCategories: {
        type: [String],
        default: [],
      },
      preferredWorkModes: {
        type: [
          {
            type: String,
            enum: ["remote", "hybrid", "onsite"],
          },
        ],
        default: [],
      },
    },

    visibility: {
      type: String,
      enum: PROFILE_VISIBILITIES,
      default: "public",
      required: true,
    },

    onboardingStatus: {
      type: onboardingSchema,
      default: () => ({}),
    },

    verificationStatus: {
      type: String,
      enum: CLIENT_VERIFICATION_STATUSES,
      default: "not_submitted",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Company clients must provide a company name.
// Individual clients do not need business information.
clientProfileSchema.pre("validate", function () {
  if (
    this.clientType === "company" &&
    !this.businessInformation?.companyName?.trim()
  ) {
    this.invalidate(
      "businessInformation.companyName",
      "Company name is required for company accounts.",
    );
  }
});

// One ClientProfile per User
clientProfileSchema.index(
  { userId: 1 },
  {
    unique: true,
    name: "uniq_client_profile_user",
  },
);

// Client discovery filtering
clientProfileSchema.index(
  { visibility: 1, clientType: 1 },
  {
    name: "idx_client_profile_discovery",
  },
);

// Model type
export type ClientProfile = InferSchemaType<typeof clientProfileSchema>;

export type ClientProfileDocument = HydratedDocument<ClientProfile>;

// Prevent model recompilation during development hot reload
export const ClientProfileModel =
  models.ClientProfile ??
  model<ClientProfile>("ClientProfile", clientProfileSchema);
