import type { RequestHandler } from "express";
import type { RegisterUserInput } from "./user.validation.js";
import { DuplicateUserError, registerUser } from "./user.service.js";

export const registerController: RequestHandler = async (_req, res, next) => {
  try {
    const input = res.locals.registerUserInput as RegisterUserInput;

    const user = await registerUser(input);

    res.status(201).json({
      message: "Account registered successfully",
      data: { user },
    });
  } catch (error: unknown) {
    if (error instanceof DuplicateUserError) {
      res.status(409).json({
        error: {
          code: "ACCOUNT_ALREADY_EXISTS",
          message: "An account with this email or username already exists.",
        },
      });
      return;
    }

    next(error);
  }
};
