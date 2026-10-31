export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiErrorOptions {
  description?: string;
  code?: string;
  errors?: ApiFieldError[];
}

export class ApiError extends Error {
  readonly success = false;
  readonly statusCode: number;
  readonly description: string;
  readonly code: string;
  readonly errors: ApiFieldError[];

  constructor(
    message: string,
    statusCode = 500,
    options: ApiErrorOptions = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.description = options.description ?? message;
    this.code = options.code ?? "API_ERROR";
    this.errors = options.errors ?? [];

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
