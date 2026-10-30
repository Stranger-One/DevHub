import type { Request, Response, NextFunction } from "express";

import { getAccessTokenFromCookies } from "../utils/cookie.utils.js";
import { authenticateAccessToken } from "../services/authentication.service.js";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const accessToken = getAccessTokenFromCookies(req.cookies);

    if (!accessToken) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const auth = await authenticateAccessToken(accessToken);

    res.locals.auth = auth;

    next();
  } catch (error) {
    next(error);
  }
};
