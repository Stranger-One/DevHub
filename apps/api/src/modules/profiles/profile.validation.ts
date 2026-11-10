import { z } from "zod";

import {
  AVAILABILITY_STATUSES,
  DEVELOPER_OPPORTUNITY_TYPES,
  PROFILE_VISIBILITIES,
} from "./profile.types.js";

// Reusable media metadata
export const mediaAssetSchema = z
  .object({
    url: z.string().url(),
    publicId: z.string().trim().min(1).max(300),
  })
  .strict();

// Structured location
export const locationSchema = z
  .object({
    country: z.string().trim().max(100).optional(),
    state: z.string().trim().max(100).optional(),
    city: z.string().trim().max(100).optional(),
  })
  .strict();

// Education
export const educationSchema = z
  .object({
    institution: z.string().trim().min(1).max(150),
    degree: z.string().trim().max(100).optional(),
    fieldOfStudy: z.string().trim().max(100).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    currentlyStudying: z.boolean().default(false),
    description: z.string().trim().max(1000).optional(),
  })
  .strict()
  .refine((data) => !data.currentlyStudying || data.endDate === undefined, {
    message: "End date must be empty while currently studying.",
    path: ["endDate"],
  });

// Experience
export const experienceSchema = z
  .object({
    company: z.string().trim().min(1).max(150),
    position: z.string().trim().min(1).max(120),
    employmentType: z.string().trim().max(50).optional(),
    location: z.string().trim().max(150).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    currentlyWorking: z.boolean().default(false),
    description: z.string().trim().max(2000).optional(),
  })
  .strict()
  .refine((data) => !data.currentlyWorking || data.endDate === undefined, {
    message: "End date must be empty while currently working.",
    path: ["endDate"],
  });

// Common profile settings
export const profileVisibilitySchema = z.enum(PROFILE_VISIBILITIES);

// Availability
export const availabilitySchema = z.enum(AVAILABILITY_STATUSES);

// Career opportunity preferences
export const opportunityTypesSchema = z
  .array(z.enum(DEVELOPER_OPPORTUNITY_TYPES))
  .max(5)
  .default([]);

// Reusable social URL
export const optionalUrlSchema = z.string().trim().url().max(300).optional();

// Reusable string array
export const stringArraySchema = z
  .array(z.string().trim().min(1).max(50))
  .max(50)
  .default([]);

// Export inferred types
export type MediaAssetInput = z.infer<typeof mediaAssetSchema>;

export type LocationInput = z.infer<typeof locationSchema>;

export type EducationInput = z.infer<typeof educationSchema>;

export type ExperienceInput = z.infer<typeof experienceSchema>;
