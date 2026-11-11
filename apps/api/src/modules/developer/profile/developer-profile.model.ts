import { HydratedDocument, InferSchemaType, model, Schema } from "mongoose";

const mediaSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, trim: true },
    type: { type: String, enum: ["image", "video", "document", "link"] },
    title: { type: String, trim: true, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 500 },
  },
  { _id: true },
);

const educationSchema = new Schema(
  {
    institution: { type: String, required: true, trim: true, maxlength: 150 },
    degree: { type: String, trim: true, maxlength: 100 },
    fieldOfStudy: { type: String, trim: true, maxlength: 100 },
    startDate: { type: Date, required: true },
    endDate: Date,
    currentlyStudying: { type: Boolean, default: false },
    description: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: false, _id: true },
);

const experienceSchema = new Schema(
  {
    company: { type: String, required: true, trim: true, maxlength: 150 },
    position: { type: String, required: true, trim: true, maxlength: 120 },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "freelance", "internship"],
    },
    location: { type: String, trim: true, maxlength: 150 },
    workingType: { type: String, enum: ["remote", "on-site", "hybrid"] },
    startDate: Date,
    endDate: Date,
    currentlyWorking: { type: Boolean, default: false },
    description: { type: String, trim: true, maxlength: 2000 },
    skills: [{ type: String, trim: true, maxlength: 50 }],
  },
  { timestamps: false, _id: true },
);

const introductionSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    pronouns: {
      type: String,
      enum: ["he/him", "she/her", "they/them", "other"],
    },
    profilePicture: { url: String, publicId: String },
    coverImage: { url: String, publicId: String },
    headline: { type: String, trim: true, maxlength: 220 },
    location: {
      country: String,
      state: String,
      city: String,
      postalCode: String,
    },
  },
  { _id: false },
);

const aboutSchema = new Schema(
  {
    description: { type: String, trim: true, maxlength: 2600 },
    specialties: [{ type: String, trim: true, maxlength: 100 }],
  },
  { _id: false },
);

const certificationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    issuingOrganization: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    issueDate: { type: Date, required: true },
    expirationDate: Date,
    doesNotExpire: { type: Boolean, default: false },
    credentialId: { type: String, trim: true, maxlength: 150 },
    credentialUrl: { type: String, trim: true, maxlength: 300 },
    skills: [{ type: String, trim: true, maxlength: 50 }],
    media: [mediaSchema],
  },
  { timestamps: true, _id: true },
);

const linkSchema = new Schema(
  {
    platform: { type: String, required: true, trim: true, maxlength: 50 },
    label: { type: String, trim: true, maxlength: 100 },
    url: { type: String, required: true, trim: true, maxlength: 300 },
  },
  { _id: true },
);

const developerProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    introduction: { type: introductionSchema },
    about: { type: aboutSchema, default: () => ({}) },
    skills: [{ type: String, trim: true, maxlength: 50 }],
    education: { type: [educationSchema], default: [] },
    experience: { type: [experienceSchema], default: [] },
    certifications: { type: [certificationSchema], default: [] },
    socialLinks: { type: [linkSchema], default: [] },
    completionPercentage: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true, versionKey: false },
);

developerProfileSchema.index(
  { userId: 1 },
  { unique: true, name: "uniq_developer_profile_user" },
);
export type DeveloperProfile = InferSchemaType<typeof developerProfileSchema>;
export type DeveloperProfileDocument = HydratedDocument<DeveloperProfile>;
export const DeveloperProfileModel = model<DeveloperProfile>(
  "DeveloperProfile",
  developerProfileSchema,
);
