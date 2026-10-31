import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { ApiError } from "../errors/api-error.js";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(
        new ApiError("Validation failed", 400, {
          code: "VALIDATION_ERROR",
          description: "One or more fields are invalid.",
          errors: result.error.issues.map((issue: any) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        }),
      );
      return;
    }

    req.body = result.data;
    next();
  };
};
