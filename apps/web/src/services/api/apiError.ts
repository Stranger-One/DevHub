// services/api/apiError.ts

import type { ApiFieldError } from "../../types/api.types";

export interface ApiErrorOptions {
  message: string;
  statusCode?: number;
  code?: string;
  errors?: ApiFieldError[];
  isNetworkError?: boolean;
  isTimeout?: boolean;
}

export class ApiError extends Error {
  statusCode?: number;
  code?: string;
  errors: ApiFieldError[];
  isNetworkError: boolean;
  isTimeout: boolean;

  constructor(options: ApiErrorOptions) {
    super(options.message);

    this.name = "ApiError";
    this.statusCode = options.statusCode;
    this.code = options.code;
    this.errors = options.errors ?? [];
    this.isNetworkError = options.isNetworkError ?? false;
    this.isTimeout = options.isTimeout ?? false;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
