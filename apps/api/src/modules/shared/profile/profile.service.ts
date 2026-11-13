import { Types } from "mongoose";
import { ApiError } from "../../../errors/api-error.js";
import { ErrorCode } from "../../../errors/error-code.js";
import { UserModel } from "../../users/user.model.js";
import { DeveloperProfileDocument, DeveloperProfileModel } from "../../developer/profile/developer-profile.model.js";

export const getProfileById = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError("Invalid user ID", 400, {
      code: ErrorCode.RESOURCE_NOT_FOUND,
    });
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError("User not found", 404, {
      code: ErrorCode.RESOURCE_NOT_FOUND,
    });
  }

  let profile: DeveloperProfileDocument | null = null;
  if (user.role === "developer") {
    profile = await DeveloperProfileModel.findOne({ userId })
  } 

  if (!profile ) {
    throw new ApiError("Profile not found", 404, {
      code: ErrorCode.RESOURCE_NOT_FOUND,
    });
  }

  if (profile.userId.toString() !== userId) {
    profile.set("completionPercentage", undefined); // Hide completion percentage for other users
  }
  
  return profile;
};
