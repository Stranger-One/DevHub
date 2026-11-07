import type { Request, Response, NextFunction } from "express";

import { getAccessTokenFromCookies } from "../utils/cookie.utils.js";
import { authenticateAccessToken } from "../services/authentication.service.js";
import { ApiError } from "../../../errors/api-error.js";
import { ErrorCode } from "../../../errors/error-code.js";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const accessToken = getAccessTokenFromCookies(req.cookies);

    if (!accessToken) {
      next(
        new ApiError("Authentication required", 401, {
          code: ErrorCode.AUTHENTICATION_ERROR,
        }),
      );
      return;
    }

    const auth = await authenticateAccessToken(accessToken);

    res.locals.auth = auth;

    next();
  } catch (error) {
    next(error);
  }
};
