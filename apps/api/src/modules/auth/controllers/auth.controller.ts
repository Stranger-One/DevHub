import type { Request, Response, NextFunction } from "express";

import {
  loginWithEmail,
  refreshSession,
  logoutSession,
  logoutAllSessions,
  getAuthenticatedUser,
  sendForgotPasswordOtp,
  verifyResetPassword,
} from "../services/authentication.service.js";

import {
  setAuthCookies,
  clearAuthCookies,
  getRefreshTokenFromCookies,
} from "../utils/cookie.utils.js";
import { ApiError } from "../../../errors/api-error.js";

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
      data: {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
          emailVerified: user.emailVerified,
        },
      },
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
      next(
        new ApiError("Refresh token not found", 401, {
          code: "AUTH_REFRESH_TOKEN_MISSING",
        }),
      );
      return;
    }

    const tokens = await refreshSession(refreshToken);

    setAuthCookies(res, tokens);

    console.log("/auth/refresh called, new tokens set in cookies");

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
      data: {
        user: {
          id: userObject._id,
          email: userObject.email,
          username: userObject.username,
          role: userObject.role,
          emailVerified: userObject.emailVerified,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = await sendForgotPasswordOtp(req.body.email);

    res.status(200).json({
      success: true,
      message: "An OTP has been sent to your email for password reset.",
      data: {
        user: {
          id: userId
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Implement the logic for resetting the password using the provided OTP and new password
    await verifyResetPassword(req.body);

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
    });
    
  } catch (error) {
    next(error);
  }
}
