import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { ApiError } from "../errors/api-error.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    error = new ApiError("Validation failed", 400, {
      code: "VALIDATION_ERROR",
      description: "One or more fields are invalid.",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (!(error instanceof ApiError)) {
    console.error("Unexpected API error:", error);
    error = new ApiError("Internal server error", 500, {
      code: "INTERNAL_SERVER_ERROR",
      description: "An unexpected error occurred.",
    });
  }

  res.status(error.statusCode).json({
    success: error.success,
    message: error.message,
    description: error.description,
    code: error.code,
    errors: error.errors,
  });
};
