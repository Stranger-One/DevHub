import { z } from "zod";

import {
  AVAILABILITY_STATUSES,
  DEVELOPER_OPPORTUNITY_TYPES,
  PROFILE_VISIBILITIES,
} from "../profile.types.js";

import {
  availabilitySchema,
  educationSchema,
  experienceSchema,
  locationSchema,
  mediaAssetSchema,
  opportunityTypesSchema,
  optionalUrlSchema,
} from "../profile.validation.js";

// Basic information
const developerPersonalInformationSchema = z
  .object({
    displayName: z.string().trim().min(2).max(80).optional(),
    headline: z.string().trim().max(120).optional(),
    bio: z.string().trim().max(1000).optional(),
    avatar: mediaAssetSchema.optional(),
    coverImage: mediaAssetSchema.optional(),
  })
  .strict();

// Professional information
const developerProfessionalInformationSchema = z
  .object({
    experienceLevel: z
      .enum(["entry", "junior", "mid", "senior", "lead"])
      .optional(),
    specialization: z.string().trim().max(120).optional(),
  })
  .strict();

// Social links
const developerSocialLinksSchema = z
  .object({
    github: optionalUrlSchema,
    linkedin: optionalUrlSchema,
    portfolio: optionalUrlSchema,
    website: optionalUrlSchema,
  })
  .strict();

// First-save and subsequent profile updates
export const developerProfileUpdateSchema = z
  .object({
    personalInformation: developerPersonalInformationSchema.optional(),
    professionalInformation: developerProfessionalInformationSchema.optional(),
    skills: z.array(z.string().trim().min(1).max(50)).max(50).optional(),
    education: z.array(educationSchema).max(30).optional(),
    experience: z.array(experienceSchema).max(50).optional(),
    location: locationSchema.optional(),
    socialLinks: developerSocialLinksSchema.optional(),
    availability: availabilitySchema.optional(),
    careerPreferences: z
      .object({
        opportunityTypes: opportunityTypesSchema,
      })
      .strict()
      .optional(),

    visibility: z.enum(PROFILE_VISIBILITIES).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one profile section must be provided.",
  });

export type DeveloperProfileUpdateInput = z.infer<
  typeof developerProfileUpdateSchema
>;
