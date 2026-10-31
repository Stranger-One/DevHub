// services/api/apiError.ts

import type { ApiFieldError } from "../../types/api.types";

export interface ApiErrorOptions {
  message: string;
  description?: string;
  statusCode?: number;
  code?: string;
  errors?: ApiFieldError[];
  isNetworkError?: boolean;
  isTimeout?: boolean;
}

export class ApiError extends Error {
  success = false as const;
  statusCode?: number;
  description: string;
  code?: string;
  errors: ApiFieldError[];
  isNetworkError: boolean;
  isTimeout: boolean;

  constructor(options: ApiErrorOptions) {
    super(options.message);

    this.name = "ApiError";
    this.description = options.description ?? options.message;
    this.statusCode = options.statusCode;
    this.code = options.code;
    this.errors = options.errors ?? [];
    this.isNetworkError = options.isNetworkError ?? false;
    this.isTimeout = options.isTimeout ?? false;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
