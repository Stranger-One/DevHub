import type { Request, Response, NextFunction } from "express";

import {
  loginWithEmail,
  refreshSession,
  logoutSession,
  logoutAllSessions,
  getAuthenticatedUser,
} from "../services/authentication.service.js";

import {
  setAuthCookies,
  clearAuthCookies,
  getRefreshTokenFromCookies,
} from "../utils/cookie.utils.js";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await loginWithEmail(req.body, {
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });

    setAuthCookies(res, result.tokens);

    const user = result.user.toObject();
    delete user.passwordHash;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const refreshToken = getRefreshTokenFromCookies(req.cookies);

    if (!refreshToken) {
      clearAuthCookies(res);

      res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
      return;
    }

    const tokens = await refreshSession(refreshToken);

    setAuthCookies(res, tokens);

    res.status(200).json({
      success: true,
      message: "Session refreshed successfully",
    });
  } catch (error) {
    clearAuthCookies(res);
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const refreshToken = getRefreshTokenFromCookies(req.cookies);

    await logoutSession(refreshToken);

    clearAuthCookies(res);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const logoutAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = res.locals.auth as { userId: string };

    await logoutAllSessions(userId);

    clearAuthCookies(res);

    res.status(200).json({
      success: true,
      message: "Logged out from all devices successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = res.locals.auth as { userId: string };

    const user = await getAuthenticatedUser(userId);

    const userObject = user.toObject();
    delete userObject.passwordHash;

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: { user: userObject },
    });
  } catch (error) {
    next(error);
  }
};
