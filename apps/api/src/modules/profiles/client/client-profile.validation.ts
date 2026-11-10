import { z } from "zod";

import { CLIENT_TYPES, PROFILE_VISIBILITIES } from "../profile.types.js";

import {
  locationSchema,
  mediaAssetSchema,
  optionalUrlSchema,
} from "../profile.validation.js";

const clientPersonalInformationSchema = z
  .object({
    displayName: z.string().trim().min(2).max(80),
    bio: z.string().trim().max(1000).optional(),
    avatar: mediaAssetSchema.optional(),
  })
  .strict();

const clientBusinessInformationSchema = z
  .object({
    companyName: z.string().trim().min(2).max(150).optional(),
    description: z.string().trim().max(2000).optional(),
    industry: z.string().trim().max(100).optional(),
    companySize: z
      .enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"])
      .optional(),
    website: optionalUrlSchema,
    logo: mediaAssetSchema.optional(),
  })
  .strict();

const clientContactInformationSchema = z
  .object({
    businessEmail: z.string().email().max(254).optional(),
    phone: z.string().trim().max(30).optional(),
  })
  .strict();

const clientHiringPreferencesSchema = z
  .object({
    hiringCategories: z
      .array(z.string().trim().min(1).max(50))
      .max(30)
      .optional(),

    preferredWorkModes: z
      .array(z.enum(["remote", "hybrid", "onsite"]))
      .optional(),
  })
  .strict();

// First successful profile save
export const clientProfileCreateSchema = z
  .object({
    clientType: z.enum(CLIENT_TYPES),
    personalInformation: clientPersonalInformationSchema,
    businessInformation: clientBusinessInformationSchema.optional(),
    location: locationSchema.optional(),
    contactInformation: clientContactInformationSchema.optional(),
    hiringPreferences: clientHiringPreferencesSchema.optional(),
    visibility: z.enum(PROFILE_VISIBILITIES).optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (
      data.clientType === "company" &&
      !data.businessInformation?.companyName?.trim()
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["businessInformation", "companyName"],
        message: "Company name is required for company accounts.",
      });
    }
  });

// Subsequent partial updates
export const clientProfileUpdateSchema = z
  .object({
    personalInformation: z
      .object({
        displayName: z.string().trim().min(2).max(80).optional(),
        bio: z.string().trim().max(1000).optional(),
        avatar: mediaAssetSchema.optional(),
      })
      .strict()
      .optional(),

    businessInformation: clientBusinessInformationSchema.partial().optional(),
    location: locationSchema.optional(),
    contactInformation: clientContactInformationSchema.partial().optional(),
    hiringPreferences: clientHiringPreferencesSchema.partial().optional(),
    visibility: z.enum(PROFILE_VISIBILITIES).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one profile section must be provided.",
  });

export type ClientProfileCreateInput = z.infer<
  typeof clientProfileCreateSchema
>;

export type ClientProfileUpdateInput = z.infer<
  typeof clientProfileUpdateSchema
>;
