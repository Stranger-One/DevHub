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
    const parsed = registerSchema.safeParse(req.body);

    console.log("Parsed", parsed);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.issues.map((issue: any) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    await registerWithEmail(parsed.data);

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
    const parsed = resendRegistrationOtpSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten(),
      });
      return;
    }

    await resendRegistrationOTP(parsed.data.email);

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
    const parsed = completeRegistrationSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten(),
      });
      return;
    }

    const result = await completeEmailRegistration(parsed.data, {
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
