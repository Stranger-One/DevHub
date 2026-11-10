import type { Request, Response, NextFunction } from "express";

import { ApiError } from "../../../errors/api-error.js";
import { ErrorCode } from "../../../errors/error-code.js";

import { developerProfileUpdateSchema } from "./developer-profile.validation.js";

import {
  getMyDeveloperProfile,
  saveDeveloperProfile,
} from "./developer-profile.service.js";

// Helper: ensure the request is authenticated.
const getAuthenticatedUserId = (req: Request): string => {
  if (!req.user) {
    throw new ApiError("Authentication required.", 401, {
      code: ErrorCode.AUTHENTICATION_ERROR,
      description: "You must be authenticated to access this resource.",
    });
  }

  return req.user.userId;
};

// GET /developer/me
export const getMyDeveloperProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);

    const result = await getMyDeveloperProfile(userId);

    res.status(200).json({
      success: true,
      message: "Developer profile retrieved successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /developer/me
export const saveMyDeveloperProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);
    const data = req.body;

    // Create on first save or update an existing profile.
    const profile = await saveDeveloperProfile(userId, data);

    res.status(200).json({
      success: true,
      message: "Developer profile saved successfully.",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
