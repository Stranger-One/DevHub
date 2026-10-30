import type { Request, Response, NextFunction } from "express";
import {
  registerSchema,
  completeRegistrationSchema,
  resendRegistrationOtpSchema,
} from "../auth.validation.js";
import {
  registerWithEmail,
  resendRegistrationOTP,
  completeEmailRegistration,
} from "../services/registration.service.js";
import { setAuthCookies } from "../utils/cookie.utils.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = req.body

    console.log("Request Body: ", body)

    await registerWithEmail(body);

    res.status(201).json({
      success: true,
      message: "Registration started. Please verify your email.",
    });
  } catch (error) {
    next(error);
  }
};

export const resendRegistrationOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = req.body;

    await resendRegistrationOTP(body.email);

    res.status(200).json({
      success: true,
      message: "A new verification code has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

export const completeRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = req.body;

    const result = await completeEmailRegistration(body, {
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });

    setAuthCookies(res, result.tokens);

    const user = result.user.toObject();

    delete user.passwordHash;

    res.status(201).json({
      success: true,
      message: "Registration completed successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
