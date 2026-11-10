import { Types } from "mongoose";
import { profileErrors } from "../profile.errors.js";
import { UserModel } from "../../users/user.model.js";
import { DeveloperProfileModel } from "./developer-profile.model.js";
import { DeveloperProfileUpdateInput } from "./developer-profile.validation.js";
import { calculateDeveloperCompletion } from "./developer-profile.completion.js";


const verifyDeveloperAccount = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw profileErrors.invalidUserId();
  }

  const user = await UserModel.findById(userId).select("_id role").lean();

  if (!user) {
    throw profileErrors.userNotFound();
  }

  if (user.role !== "developer") {
    throw profileErrors.unauthorizedRole();
  }

  return user;
};

// Get the authenticated developer's profile
export const getMyDeveloperProfile = async (userId: string) => {
  await verifyDeveloperAccount(userId);

  const profile = await DeveloperProfileModel.findOne({
    userId: new Types.ObjectId(userId),
  });

  if (!profile) {
    return {
      profileExists: false,
      profile: null,
      onboardingStatus: "not_started" as const,
    };
  }

  const profileCompletion = calculateDeveloperCompletion(profile);

  return {
    profileExists: true,
    profile,
    profileCompletion,
    onboardingStatus: profile.onboardingStatus.status,
  };
};

// Save or update the authenticated developer's profile
export const saveDeveloperProfile = async (
  userId: string,
  data: DeveloperProfileUpdateInput,
  currentStep?: string,
) => {
  await verifyDeveloperAccount(userId);

  const objectId = new Types.ObjectId(userId);

  let profile = await DeveloperProfileModel.findOne({
    userId: objectId,
  });

  if (!profile) {
    profile = new DeveloperProfileModel({
      userId: objectId,
      ...data,
      onboardingStatus: {
        status: "in_progress",
        currentStep: currentStep ?? "basic-information",
      },
    });
  } else {
    // Set only supplied fields.
    // Existing unrelated sections remain intact.
    profile.set(data);

    if (profile.onboardingStatus.status !== "completed") {
      profile.onboardingStatus.status = "in_progress";
    }

    if (currentStep) {
      profile.onboardingStatus.currentStep = currentStep;
    }
  }

  try {
    await profile.save();

    return profile;
  } catch (error) {
    // Two simultaneous first-save requests can race
    // against the unique userId index.
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      const existingProfile = await DeveloperProfileModel.findOne({
        userId: objectId,
      });

      if (!existingProfile) {
        throw profileErrors.duplicateProfile();
      }

      existingProfile.set(data);

      if (existingProfile.onboardingStatus.status !== "completed") {
        existingProfile.onboardingStatus.status = "in_progress";
      }

      if (currentStep) {
        existingProfile.onboardingStatus.currentStep = currentStep;
      }

      await existingProfile.save();

      return existingProfile;
    }

    throw error;
  }
};
