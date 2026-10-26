import type { RequestHandler } from "express";
import { loginUserSchema, registerUserSchema } from "./user.validation.js";
import { loginUser, registerUser } from "./user.service.js";
import { createSession } from "./session.service.js";
import { setRefreshCookie } from "./auth.cookie.js";

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
