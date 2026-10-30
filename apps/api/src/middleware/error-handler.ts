import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AuthServiceError } from "../modules/auth/services/registration.service.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof AuthServiceError) {
    res.status(error.statusCode).json({
      success: false,
      code: "AUTH_SERVICE_ERROR",
      message: error.message,
    });
    return;
  }

  console.error("Unexpected API error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
