import {
  HydratedDocument,
  InferSchemaType,
  model,
  models,
  Schema,
  Types,
} from "mongoose";

import {
  AVAILABILITY_STATUSES,
  DEVELOPER_OPPORTUNITY_TYPES,
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

// Structured location schema
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

// Education subdocument
const educationSchema = new Schema(
  {
    institution: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    degree: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    fieldOfStudy: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    startDate: {
      required: true,
      type: Date,
    },
    endDate: {
      type: Date,
    },
    currentlyStudying: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: false },
);

// Experience subdocument
const experienceSchema = new Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    position: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    employmentType: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    currentlyWorking: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  { timestamps: false },
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

// Main DeveloperProfile schema
const developerProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    personalInformation: {
      displayName: {
        type: String,
        trim: true,
        maxlength: 80,
      },
      headline: {
        type: String,
        trim: true,
        maxlength: 120,
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
      coverImage: {
        type: mediaAssetSchema,
        default: undefined,
      },
    },

    professionalInformation: {
      experienceLevel: {
        type: String,
        enum: ["entry", "junior", "mid", "senior", "lead"],
      },
      specialization: {
        type: String,
        trim: true,
        maxlength: 120,
      },
    },

    skills: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: 50,
        },
      ],
      default: [],
    },

    education: {
      type: [educationSchema],
      default: [],
    },

    experience: {
      type: [experienceSchema],
      default: [],
    },

    location: {
      type: locationSchema,
      default: () => ({}),
    },

    socialLinks: {
      github: {
        type: String,
        trim: true,
        maxlength: 300,
      },
      linkedin: {
        type: String,
        trim: true,
        maxlength: 300,
      },
      portfolio: {
        type: String,
        trim: true,
        maxlength: 300,
      },
      website: {
        type: String,
        trim: true,
        maxlength: 300,
      },
    },

    availability: {
      type: String,
      enum: AVAILABILITY_STATUSES,
      default: "available",
    },

    careerPreferences: {
      opportunityTypes: {
        type: [
          {
            type: String,
            enum: DEVELOPER_OPPORTUNITY_TYPES,
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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// One DeveloperProfile per User
developerProfileSchema.index(
  { userId: 1 },
  {
    unique: true,
    name: "uniq_developer_profile_user",
  },
);

// Model type
export type DeveloperProfile = InferSchemaType<typeof developerProfileSchema>;

// Hydrated document type
export type DeveloperProfileDocument = HydratedDocument<DeveloperProfile>;

// Prevent model recompilation during development hot reload
export const DeveloperProfileModel =
  models.DeveloperProfile ??
  model<DeveloperProfile>("DeveloperProfile", developerProfileSchema);
