import type { Request, Response, NextFunction } from "express";

import { ApiError } from "../../../errors/api-error.js";
import { ErrorCode } from "../../../errors/error-code.js";

import {
  clientProfileCreateSchema,
  clientProfileUpdateSchema,
} from "./client-profile.validation.js";

import {
  getMyClientProfile,
  createClientProfile,
  updateClientProfile,
} from "./client-profile.service.js";

// Get authenticated user ID from the request.
const getAuthenticatedUserId = (req: Request): string => {
  if (!req.user) {
    throw new ApiError("Authentication required.", 401, {
      code: ErrorCode.AUTHENTICATION_ERROR,
    });
  }

  return req.user.userId;
};

// GET /client/me
export const getMyClientProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);

    const result = await getMyClientProfile(userId);

    res.status(200).json({
      success: true,
      message: "Client profile retrieved successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// POST /client/me
export const createMyClientProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);
    const data = req.body;

    const profile = await createClientProfile(userId, data);

    res.status(200).json({
      success: true,
      message: "Client profile saved successfully.",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /client/me
export const updateMyClientProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);

    const validation = clientProfileUpdateSchema.safeParse(req.body);

    if (!validation.success) {
      throw new ApiError("Invalid client profile data.", 400, {
        code: ErrorCode.VALIDATION_ERROR,
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const profile = await updateClientProfile(userId, validation.data);

    res.status(200).json({
      success: true,
      message: "Client profile updated successfully.",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
