import type { RequestHandler } from "express";
import { loginUserSchema, registerUserSchema } from "./user.validation.js";
import { AuthError, loginUser, registerUser } from "./user.service.js";
import {
  createSession,
  revokeRefreshToken,
  rotateRefreshToken,
} from "./session.service.js";
import {
  clearRefreshCookie,
  REFRESH_COOKIE,
  setRefreshCookie,
} from "./auth.cookie.js";
import { verifyAccessToken } from "./auth.tokens.js";
import { Types } from "mongoose";
import { UserModel } from "./user.model.js";

export const registerController: RequestHandler = async (req, res, next) => {
  try {
    const input = registerUserSchema.parse(req.body);
    const user = await registerUser(input);
    const session = await createSession(user);

    setRefreshCookie(res, session.refreshToken, session.expiresAt);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        accessToken: session.accessToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginController: RequestHandler = async (req, res, next) => {
  try {
    const input = loginUserSchema.parse(req.body);
    const user = await loginUser(input);
    const session = await createSession(user);
    console.log("LOGIN - createSession: ", session);

    setRefreshCookie(res, session.refreshToken, session.expiresAt);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        accessToken: session.accessToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const token: unknown = req.cookies?.[REFRESH_COOKIE];

    if (typeof token !== "string" || !token) {
      throw new AuthError("Refresh token required", 401);
    }

    const result = await rotateRefreshToken(token);
    console.log("REFRESH - rotaterefreshtoken: ", result);

    setRefreshCookie(res, result.refreshToken, result.expiresAt);

    res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    clearRefreshCookie(res);
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    const token: unknown = req.cookies?.[REFRESH_COOKIE];

    if (typeof token === "string" && token) {
      await revokeRefreshToken(token);
      console.log("token", token);
    }

    clearRefreshCookie(res);

    console.log("Clear cookie attached !!!");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const me: RequestHandler = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const [scheme, token] = header?.split(" ") ?? [];

    if (scheme !== "Bearer" || !token) {
      throw new AuthError("Authentication required", 401);
    }

    const payload = verifyAccessToken(token);
    console.log("ME - verified Access Token Payload: ", payload);

    if (
      typeof payload === "string" ||
      !payload.sub ||
      !Types.ObjectId.isValid(payload.sub)
    ) {
      throw new AuthError("Invalid access token", 401);
    }

    const user = await UserModel.findById(payload.sub);

    if (!user) {
      throw new AuthError("Invalid access token", 401);
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      next(new AuthError("Invalid access token", 401));
      return;
    }

    if (error instanceof Error && error.name === "JsonWebTokenError") {
      next(new AuthError("Invalid access token", 401));
      return;
    }

    next(error);
  }
};
