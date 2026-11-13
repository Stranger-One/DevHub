import { Types } from "mongoose";
import { ApiError } from "../../../errors/api-error.js";
import { ErrorCode } from "../../../errors/error-code.js";
import { UserModel } from "../../users/user.model.js";
import { DeveloperProfileModel } from "./developer-profile.model.js";
import type {
  AboutInput,
  CertificationInput,
  CreateProfileInput,
  EducationInput,
  ExperienceInput,
  IntroductionInput,
  SocialLinkInput,
} from "./developer-profile.validation.js";

const notFound = () =>
  new ApiError("Developer profile not found", 404, {
    code: ErrorCode.RESOURCE_NOT_FOUND,
  });

const assertDeveloper = async (userId: string): Promise<void> => {
  const user = await UserModel.findById(userId).select("role");
  if (!user || user.role !== "developer") {
    throw new ApiError("Developer access required", 403, {
      code: ErrorCode.AUTHORIZATION_ERROR,
    });
  }
};

const ensureProfile = async (userId: string): Promise<void> => {
  await assertDeveloper(userId);
  await DeveloperProfileModel.updateOne(
    { userId },
    { $setOnInsert: { userId, completionPercentage: 0 } },
    { upsert: true },
  );
};

const completionPercentage = (profile: CreateProfileInput): number => {
  const sections = [
    Boolean(profile.introduction),
    Boolean(profile.about?.description || profile.about?.specialties?.length),
    Boolean(profile.skills?.length),
    Boolean(profile.education?.length),
    Boolean(profile.experience?.length),
    Boolean(profile.certifications?.length),
    Boolean(profile.socialLinks?.length),
  ];
  return Math.round((sections.filter(Boolean).length / sections.length) * 100);
};

export const createProfile = async (
  userId: string,
  input: CreateProfileInput,
) => {
  await assertDeveloper(userId);
  if (await DeveloperProfileModel.exists({ userId })) {
    throw new ApiError("Developer profile already exists", 409, {
      code: ErrorCode.RESOURCE_CONFLICT,
    });
  }
  return DeveloperProfileModel.create({
    ...input,
    userId,
    completionPercentage: completionPercentage(input),
  });
};

export const getMyProfile = async (userId: string) => {
  await assertDeveloper(userId);
  const profile = await DeveloperProfileModel.findOne({ userId });
  if (!profile) throw notFound();
  return profile;
};

export const getPublicProfile = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) throw notFound();
  const profile = await DeveloperProfileModel.findOne({ userId }).populate(
    "userId",
    "username",
  );
  if (!profile) throw notFound();
  return profile;
};

const updateProfile = async (
  userId: string,
  update: Record<string, unknown>,
) => {
  console.log("Update Payload: ", update);

  await ensureProfile(userId);
  const profile = await DeveloperProfileModel.findOneAndUpdate(
    { userId },
    { $set: update },
    { returnDocument: 'after', runValidators: true },
  );
  if (!profile) throw notFound();
  return profile;
};

export const updateIntroduction = (userId: string, input: IntroductionInput) =>
  updateProfile(
    userId,
    Object.fromEntries(
      Object.entries(input).map(([key, value]) => [
        `introduction.${key}`,
        value,
      ]),
    ),
  );
export const updateAbout = (userId: string, input: AboutInput) =>
  updateProfile(
    userId,
    Object.fromEntries(
      Object.entries(input).map(([key, value]) => [`about.${key}`, value]),
    ),
  );
export const updateSkills = (userId: string, skills: string[]) =>
  updateProfile(userId, { skills });
export const updateSocialLinks = (
  userId: string,
  socialLinks: SocialLinkInput[],
) => updateProfile(userId, { socialLinks });

const addSection = async (
  userId: string,
  section: string,
  input: Record<string, unknown>,
) => {
  await ensureProfile(userId);
  const profile = await DeveloperProfileModel.findOneAndUpdate(
    { userId },
    { $push: { [section]: input } },
    { returnDocument: 'after', runValidators: true },
  );
  if (!profile) throw notFound();
  return profile;
};

const updateSection = async (
  userId: string,
  section: "education" | "experience" | "certifications",
  itemId: string,
  input: Record<string, unknown>,
) => {
  await ensureProfile(userId);
  const profile = await DeveloperProfileModel.findOneAndUpdate(
    { userId, [`${section}._id`]: itemId },
    {
      $set: Object.fromEntries(
        Object.entries(input).map(([key, value]) => [
          `${section}.$.${key}`,
          value,
        ]),
      ),
    },
    { returnDocument: 'after', runValidators: true },
  );
  if (!profile) throw notFound();
  return profile;
};

const deleteSection = async (
  userId: string,
  section: string,
  itemId: string,
) => {
  const profile = await DeveloperProfileModel.findOneAndUpdate(
    { userId, [`${section}._id`]: itemId },
    { $pull: { [section]: { _id: itemId } } },
    { returnDocument: 'after' },
  );
  if (!profile) throw notFound();
  return profile;
};

export const addEducation = (userId: string, input: EducationInput) =>
  addSection(userId, "education", input);
export const updateEducation = (
  userId: string,
  id: string,
  input: EducationInput,
) => updateSection(userId, "education", id, input);
export const deleteEducation = (userId: string, id: string) =>
  deleteSection(userId, "education", id);
export const addExperience = (userId: string, input: ExperienceInput) =>
  addSection(userId, "experience", input);
export const updateExperience = (
  userId: string,
  id: string,
  input: ExperienceInput,
) => updateSection(userId, "experience", id, input);
export const deleteExperience = (userId: string, id: string) =>
  deleteSection(userId, "experience", id);
export const addCertification = (userId: string, input: CertificationInput) =>
  addSection(userId, "certifications", input);
export const updateCertification = (
  userId: string,
  id: string,
  input: CertificationInput,
) => updateSection(userId, "certifications", id, input);
export const deleteCertification = (userId: string, id: string) =>
  deleteSection(userId, "certifications", id);
