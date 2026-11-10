import { ApiError } from "../../errors/api-error.js";
import { ErrorCode } from "../../errors/error-code.js";


export const profileErrors = {
  userNotFound: () =>
    new ApiError("User account not found.", 404, {
      code: ErrorCode.RESOURCE_NOT_FOUND,
    }),

  unauthorizedRole: () =>
    new ApiError("You are not authorized to access this profile.", 403, {
      code: ErrorCode.AUTHORIZATION_ERROR,
    }),

  invalidUserId: () =>
    new ApiError("Invalid user ID.", 400, {
      code: ErrorCode.VALIDATION_ERROR,
    }),

  profileNotFound: () =>
    new ApiError("Profile not found. Complete your profile setup first.", 404, {
      code: ErrorCode.RESOURCE_NOT_FOUND,
    }),

  duplicateProfile: () =>
    new ApiError("A profile already exists for this account.", 409, {
      code: ErrorCode.RESOURCE_CONFLICT,
    }),
};
