import { z } from "zod";

const dateSchema = z.coerce.date();
const optionalText = (max: number) => z.string().trim().max(max).optional();

const mediaSchema = z.object({
  url: z.string().trim().url().max(300),
  publicId: z.string().trim().max(200),
  type: z.enum(["image", "video", "document", "link"]).optional(),
  title: optionalText(150),
  description: optionalText(500),
});

export const introductionSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  pronouns: z.enum(["he/him", "she/her", "they/them", "other"]).optional(),
  profilePicture: z
    .object({ url: z.string().optional(), publicId: z.string().optional() })
    .optional(),
  coverImage: z
    .object({ url: z.string().optional(), publicId: z.string().optional() })
    .optional(),
  headline: optionalText(220),
  location: z
    .object({
      country: optionalText(100),
      state: optionalText(100),
      city: optionalText(100),
      postalCode: optionalText(30),
    })
    .optional(),
});

export const aboutSchema = z.object({
  description: optionalText(2600),
  specialties: z.array(z.string().trim().min(1).max(100)).max(30).optional(),
});

const educationFields = z.object({
  institution: z.string().trim().min(1).max(150),
  degree: optionalText(100),
  fieldOfStudy: optionalText(100),
  startDate: dateSchema,
  endDate: dateSchema.optional(),
  currentlyStudying: z.boolean().optional(),
  description: optionalText(1000),
});

export const educationSchema = educationFields.refine(
  (value) =>
    value.currentlyStudying ||
    !value.endDate ||
    value.endDate >= value.startDate,
  {
    message: "End date must be after start date unless currently studying",
    path: ["endDate"],
  },
);

const experienceFields = z.object({
  company: z.string().trim().min(1).max(150),
  position: z.string().trim().min(1).max(120),
  employmentType: z
    .enum(["full-time", "part-time", "contract", "freelance", "internship"])
    .optional(),
  location: optionalText(150),
  workingType: z.enum(["remote", "on-site", "hybrid"]).optional(),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  currentlyWorking: z.boolean().optional(),
  description: optionalText(2000),
  skills: z.array(z.string().trim().min(1).max(50)).max(50).optional(),
});

export const experienceSchema = experienceFields.refine(
  (value) =>
    value.currentlyWorking ||
    !value.startDate ||
    !value.endDate ||
    value.endDate >= value.startDate,
  {
    message: "End date must be after start date unless currently working",
    path: ["endDate"],
  },
);

const certificationFields = z.object({
  name: z.string().trim().min(1).max(150),
  issuingOrganization: z.string().trim().min(1).max(150),
  issueDate: dateSchema,
  expirationDate: dateSchema.optional(),
  doesNotExpire: z.boolean().optional(),
  credentialId: optionalText(150),
  credentialUrl: z.string().trim().url().max(300).optional(),
  skills: z.array(z.string().trim().min(1).max(50)).max(50).optional(),
  media: z.array(mediaSchema).max(20).optional(),
});

export const certificationSchema = certificationFields.refine(
  (value) =>
    value.doesNotExpire ||
    !value.expirationDate ||
    value.expirationDate >= value.issueDate,
  {
    message:
      "Expiration date must be after issue date unless the certification does not expire",
    path: ["expirationDate"],
  },
);

export const socialLinkSchema = z.object({
  platform: z.string().trim().min(1).max(50),
  label: optionalText(100),
  url: z.string().trim().url().max(300),
});

export const createProfileSchema = z.object({
  introduction: introductionSchema,
  about: aboutSchema.optional(),
  skills: z.array(z.string().trim().min(1).max(50)).max(100).optional(),
  education: z.array(educationSchema).max(50).optional(),
  experience: z.array(experienceSchema).max(50).optional(),
  certifications: z.array(certificationSchema).max(50).optional(),
  socialLinks: z.array(socialLinkSchema).max(50).optional(),
});

export const updateIntroductionSchema = introductionSchema.partial();
export const updateAboutSchema = aboutSchema;
export const updateSkillsSchema = z.object({
  skills: z.array(z.string().trim().min(1).max(50)).max(100),
});
export const updateSocialLinksSchema = z.object({
  socialLinks: z.array(socialLinkSchema).max(50),
});
export const updateEducationSchema = educationFields.partial();
export const updateExperienceSchema = experienceFields.partial();
export const updateCertificationSchema = certificationFields.partial();
export const profileIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid identifier"),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type IntroductionInput = z.infer<typeof introductionSchema>;
export type AboutInput = z.infer<typeof aboutSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type CertificationInput = z.infer<typeof certificationSchema>;
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
