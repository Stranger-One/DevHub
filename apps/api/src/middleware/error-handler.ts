import type { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { ApiError } from "../errors/api-error.js";
import { ErrorCode } from "../errors/error-code.js";

const getDuplicateKeyFields = (error: unknown) => {
  if (
    typeof error !== "object" ||
    error === null ||
    !("keyValue" in error) ||
    typeof error.keyValue !== "object" ||
    error.keyValue === null
  ) {
    return [];
  }

  return Object.entries(error.keyValue).map(([field, value]) => ({
    field,
    message: `${field} is already in use`,
    value,
  }));
};

const normalizeError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error; // Already an ApiError, no need to normalize

  if (error instanceof ZodError) {
    return new ApiError("Validation failed", 400, {
      code: ErrorCode.VALIDATION_ERROR,
      description: "One or more request fields are invalid.",
      errors: error.issues.map((issue) => ({
        field: issue.path.join(".") || "request",
        message: issue.message,
      })),
    });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return new ApiError("Database validation failed", 422, {
      code: ErrorCode.DATABASE_ERROR,
      description: "The submitted data could not be saved.",
      errors: Object.values(error.errors).map((fieldError) => ({
        field: fieldError.path,
        message: fieldError.message,
      })),
    });
  }

  if (error instanceof mongoose.Error.CastError) {
    return new ApiError("Invalid resource identifier", 400, {
      code: ErrorCode.DATABASE_ERROR,
      description: `The ${error.path} value is not a valid identifier.`,
    });
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    const duplicateFields = getDuplicateKeyFields(error);
    const duplicateField = duplicateFields[0]?.field;
    const isEmailConflict = duplicateField === "email";
    const isUsernameConflict = duplicateField === "username";

    return new ApiError(
      isEmailConflict
        ? "An account with this email already exists"
        : isUsernameConflict
          ? "This username is already taken"
          : "Resource already exists",
      409,
      {
        code: ErrorCode.DATABASE_ERROR,
        description: isEmailConflict
          ? "Use a different email address or sign in to the existing account."
          : isUsernameConflict
            ? "Choose a different username for your account."
            : "A resource with the same unique value already exists.",
        errors: duplicateFields.map(({ field, message }) => ({
          field,
          message,
        })),
      },
    );
  }

  if (error instanceof mongoose.Error) {
    return new ApiError("Database request failed", 503, {
      code: ErrorCode.DATABASE_ERROR,
      description: "The database service could not complete the request.",
    });
  }

  console.error("Unexpected API error:", error);
  return new ApiError("Internal server error", 500, {
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    description: "An unexpected error occurred. Please try again later.",
  });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const apiError = normalizeError(error);

  res.status(apiError.statusCode).json({
    success: apiError.success,
    message: apiError.message,
    description: apiError.description,
    code: apiError.code,
    errors: apiError.errors,
  });
};
