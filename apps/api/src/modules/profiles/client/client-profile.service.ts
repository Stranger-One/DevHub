import { Types } from "mongoose";
import { profileErrors } from "../profile.errors.js";
import { UserModel } from "../../users/user.model.js";
import { ClientProfileModel } from "./client-profile.model.js";
import { ClientProfileCreateInput, ClientProfileUpdateInput } from "./client-profile.validation.js";
import { ApiError } from "../../../errors/api-error.js";
import { ErrorCode } from "../../../errors/error-code.js";
import { calculateClientCompletion } from "./client-profile.completion.js";

const verifyClientAccount = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw profileErrors.invalidUserId();
  }

  const user = await UserModel.findById(userId).select("_id role").lean();

  if (!user) {
    throw profileErrors.userNotFound();
  }

  if (user.role !== "client") {
    throw profileErrors.unauthorizedRole();
  }

  return user;
};

const clientTypeConflict = () =>
  new ApiError(
    "Client type cannot be changed after profile creation.",
    409,
    {
      code: ErrorCode.RESOURCE_CONFLICT,
    },
  );

// Get the authenticated client's profile
export const getMyClientProfile = async (userId: string) => {
  await verifyClientAccount(userId);

  const profile = await ClientProfileModel.findOne({
    userId: new Types.ObjectId(userId),
  });

  if (!profile) {
    return {
      profileExists: false,
      profile: null,
      onboardingStatus: "not_started" as const,
    };
  }

  const profileCompletion =  calculateClientCompletion(profile);

  return {
    profileExists: true,
    profile,
    profileCompletion,
    onboardingStatus: profile.onboardingStatus.status,
  };
};

// First save: create the client profile.
// Repeating the same request is safe and does not create duplicates.
export const createClientProfile = async (
  userId: string,
  data: ClientProfileCreateInput,
  currentStep?: string,
) => {
  await verifyClientAccount(userId);

  const objectId = new Types.ObjectId(userId);

  let profile = await ClientProfileModel.findOne({
    userId: objectId,
  });

  if (profile) {
    if (profile.clientType !== data.clientType) {
      throw clientTypeConflict();
    }

    const { clientType: _clientType, ...updateData } = data;

    profile.set(updateData);

    if (profile.onboardingStatus.status !== "completed") {
      profile.onboardingStatus.status = "in_progress";
    }

    if (currentStep) {
      profile.onboardingStatus.currentStep = currentStep;
    }

    await profile.save();

    return profile;
  }

  profile = new ClientProfileModel({
    userId: objectId,
    ...data,
    onboardingStatus: {
      status: "in_progress",
      currentStep: currentStep ?? "basic-information",
    },
  });

  try {
    await profile.save();
    return profile;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      const existingProfile = await ClientProfileModel.findOne({
        userId: objectId,
      });

      if (!existingProfile) {
        throw profileErrors.duplicateProfile();
      }

      if (existingProfile.clientType !== data.clientType) {
        throw clientTypeConflict();
      }

      const { clientType: _clientType, ...updateData } = data;

      existingProfile.set(updateData);

      await existingProfile.save();

      return existingProfile;
    }

    throw error;
  }
};

// Update an existing client profile.
// clientType is deliberately absent from the update schema.
export const updateClientProfile = async (
  userId: string,
  data: ClientProfileUpdateInput,
) => {
  await verifyClientAccount(userId);

  const profile = await ClientProfileModel.findOne({
    userId: new Types.ObjectId(userId),
  });

  if (!profile) {
    throw profileErrors.profileNotFound();
  }

  profile.set(data);

  await profile.save();

  return profile;
};
