import type { RequestHandler } from "express";
import { registerUserSchema } from "./user.validation.js";

export const validateRegistration: RequestHandler = (req, res, next) => {
  const result = registerUserSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid registration data",
        details: result.error.issues.map((issue: any) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }

  res.locals.registerUserInput = result.data;
  next();
};
