import { ErrorCode } from "./error-code.js";

const DEFAULT_DESCRIPTIONS: Record<ErrorCode, string> = {
  [ErrorCode.VALIDATION_ERROR]: "One or more request fields are invalid.",
  [ErrorCode.DATABASE_ERROR]: "The database could not complete the request.",
  [ErrorCode.AUTHENTICATION_ERROR]: "Authentication could not be completed.",
  [ErrorCode.AUTHORIZATION_ERROR]:
    "You are not allowed to perform this action.",
  [ErrorCode.SESSION_ERROR]: "The session could not be completed.",
  [ErrorCode.TOKEN_ERROR]: "The token is invalid or expired.",
  [ErrorCode.OTP_ERROR]: "The one-time password could not be verified.",
  [ErrorCode.EMAIL_ERROR]: "The email operation could not be completed.",
  [ErrorCode.RESOURCE_NOT_FOUND]: "The requested resource does not exist.",
  [ErrorCode.RESOURCE_CONFLICT]: "The requested resource is already in use.",
  [ErrorCode.INCOMPLETE_REGISTRATION]:
    "The registration must be completed before continuing.",
  [ErrorCode.CONFIGURATION_ERROR]:
    "A required server service is not configured correctly.",
  [ErrorCode.INTERNAL_SERVER_ERROR]: "An unexpected server error occurred.",
};

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiErrorOptions {
  description?: string;
  code: ErrorCode;
  errors?: ApiFieldError[];
}

export class ApiError extends Error {
  readonly success = false;
  readonly statusCode: number;
  readonly description: string;
  readonly code: ErrorCode;
  readonly errors: ApiFieldError[];

  constructor(message: string, statusCode = 500, options: ApiErrorOptions) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.description =
      options.description ?? DEFAULT_DESCRIPTIONS[options.code];
    this.code = options.code;
    this.errors = options.errors ?? [];

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
