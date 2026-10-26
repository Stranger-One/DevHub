import type { RequestHandler } from "express";
import { loginUserSchema, registerUserSchema } from "./user.validation.js";

export const validateRegistration: RequestHandler = (req, res, next) => {
  const result = registerUserSchema.safeParse(req.body);

  console.log("Validation Result: ", result);

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

export const validateLogin: RequestHandler = (req, res, next) => {
  const result = loginUserSchema.safeParse(req.body);

  console.log("Validation Result: ", result);

  if (!result.success) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid login data",
        details: result.error.issues.map((issue: any) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }

  res.locals.loginUserInput = result.data;
  next();
};
