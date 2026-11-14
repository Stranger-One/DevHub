import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../errors/api-error.js";
import { ErrorCode } from "../../../errors/error-code.js";
import * as profileService from "./developer-profile.service.js";
import { profileIdSchema } from "./developer-profile.validation.js";

const getUserId = (req: Request): string => {
  if (!req.user) {
    throw new ApiError("Authentication required", 401, {
      code: ErrorCode.AUTHENTICATION_ERROR,
    });
  }

  return req.user.userId;
};

const sendProfile = (
  res: Response,
  statusCode: number,
  message: string,
  profile: unknown,
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data: { profile },
  });
};

// export const create = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<void> => {
//   try {
//     const profile = await profileService.createProfile(
//       getUserId(req),
//       req.body,
//     );
//     sendProfile(res, 201, "Developer profile created", profile);
//   } catch (error) {
//     next(error);
//   }
// };

// export const me = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<void> => {
//   try {
//     const profile = await profileService.getMyProfile(getUserId(req));
//     sendProfile(res, 200, "Developer profile retrieved", profile);
//   } catch (error) {
//     next(error);
//   }
// };

// export const publicProfile = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<void> => {
//   try {
//     const { id } = profileIdSchema.parse({ id: req.params.userId });
//     const profile = await profileService.getPublicProfile(id);
//     sendProfile(res, 200, "Developer profile retrieved", profile);
//   } catch (error) {
//     next(error);
//   }
// };

export const introduction = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const profile = await profileService.updateIntroduction(
      getUserId(req),
      req.body,
    );
    sendProfile(res, 200, "Introduction updated", profile);
  } catch (error) {
    next(error);
  }
};

export const about = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const profile = await profileService.updateAbout(getUserId(req), req.body);
    sendProfile(res, 200, "About section updated", profile);
  } catch (error) {
    next(error);
  }
};

export const skills = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const profile = await profileService.updateSkills(
      getUserId(req),
      req.body.skills,
    );
    sendProfile(res, 200, "Skills updated", profile);
  } catch (error) {
    next(error);
  }
};


export const addSocialLink = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const profile = await profileService.addSocialLink(
      getUserId(req),
      req.body,
    );
    sendProfile(res, 201, "Social link added", profile);
  } catch (error) {
    next(error);
  }
};

export const updateSocialLink = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = profileIdSchema.parse({ id: req.params.socialLinkId });
    const profile = await profileService.updateSocialLink(
      getUserId(req),
      id,
      req.body,
    );
    sendProfile(res, 200, "Social link updated", profile);
  } catch (error) {
    next(error);
  }
};

export const deleteSocialLink = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = profileIdSchema.parse({ id: req.params.socialLinkId });
    const profile = await profileService.deleteSocialLink(getUserId(req), id);
    sendProfile(res, 200, "Social link deleted", profile);
  } catch (error) {
    next(error);
  }
};

export const addEducation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const profile = await profileService.addEducation(getUserId(req), req.body);
    sendProfile(res, 201, "Education added", profile);
  } catch (error) {
    next(error);
  }
};

export const updateEducation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = profileIdSchema.parse({ id: req.params.educationId });
    const profile = await profileService.updateEducation(
      getUserId(req),
      id,
      req.body,
    );
    sendProfile(res, 200, "Education updated", profile);
  } catch (error) {
    next(error);
  }
};

export const deleteEducation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = profileIdSchema.parse({ id: req.params.educationId });
    const profile = await profileService.deleteEducation(getUserId(req), id);
    sendProfile(res, 200, "Education deleted", profile);
  } catch (error) {
    next(error);
  }
};

export const addExperience = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const profile = await profileService.addExperience(
      getUserId(req),
      req.body,
    );
    sendProfile(res, 201, "Experience added", profile);
  } catch (error) {
    next(error);
  }
};

export const updateExperience = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = profileIdSchema.parse({ id: req.params.experienceId });
    const profile = await profileService.updateExperience(
      getUserId(req),
      id,
      req.body,
    );
    sendProfile(res, 200, "Experience updated", profile);
  } catch (error) {
    next(error);
  }
};

export const deleteExperience = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = profileIdSchema.parse({ id: req.params.experienceId });
    const profile = await profileService.deleteExperience(getUserId(req), id);
    sendProfile(res, 200, "Experience deleted", profile);
  } catch (error) {
    next(error);
  }
};

export const addCertification = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const profile = await profileService.addCertification(
      getUserId(req),
      req.body,
    );
    sendProfile(res, 201, "Certification added", profile);
  } catch (error) {
    next(error);
  }
};

export const updateCertification = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = profileIdSchema.parse({ id: req.params.certificationId });
    const profile = await profileService.updateCertification(
      getUserId(req),
      id,
      req.body,
    );
    sendProfile(res, 200, "Certification updated", profile);
  } catch (error) {
    next(error);
  }
};

export const deleteCertification = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = profileIdSchema.parse({ id: req.params.certificationId });
    const profile = await profileService.deleteCertification(
      getUserId(req),
      id,
    );
    sendProfile(res, 200, "Certification deleted", profile);
  } catch (error) {
    next(error);
  }
};
