import axios from "axios";

import { ApiError } from "./apiError";

import type { ApiErrorPayload, ApiFieldError } from "../../types/api.types";

interface BackendErrorResponse {
  message?: string;
  code?: string;
  statusCode?: number;
  errors?: ApiFieldError[];
}

const STATUS_MESSAGES: Record<number, string> = {
  400: "Invalid request.",
  401: "You are not authenticated.",
  403: "You don't have permission to perform this action.",
  404: "The requested resource was not found.",
  409: "A resource conflict occurred.",
  422: "Please check the submitted information.",
  429: "Too many requests. Please try again later.",
  500: "Internal server error.",
  502: "Bad gateway.",
  503: "Service is temporarily unavailable.",
  504: "Gateway timeout.",
};

function isBackendErrorResponse(value: unknown): value is BackendErrorResponse {
  return typeof value === "object" && value !== null;
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (!axios.isAxiosError(error)) {
    return new ApiError({
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      code: "UNKNOWN_ERROR",
    });
  }

  // Request timeout
  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return new ApiError({
      message: "Request timed out. Please try again.",
      code: "REQUEST_TIMEOUT",
      isTimeout: true,
    });
  }

  // Request cancelled
  if (axios.isCancel(error)) {
    return new ApiError({
      message: "Request was cancelled.",
      code: "REQUEST_CANCELLED",
    });
  }

  // Network failure: no response from server
  if (!error.response) {
    return new ApiError({
      message:
        "Unable to connect to the server. Please check your internet connection.",
      code: "NETWORK_ERROR",
      isNetworkError: true,
    });
  }

  const statusCode = error.response.status;
  const responseData: unknown = error.response.data;

  const backendError = isBackendErrorResponse(responseData) ? responseData : {};

  const errors = Array.isArray(backendError.errors)
    ? backendError.errors.filter(
        (item): item is ApiFieldError =>
          typeof item === "object" &&
          item !== null &&
          typeof item.message === "string",
      )
    : [];

  return new ApiError({
    message:
      typeof backendError.message === "string"
        ? backendError.message
        : (STATUS_MESSAGES[statusCode] ?? "Something went wrong."),
    statusCode,
    code:
      typeof backendError.code === "string" ? backendError.code : "HTTP_ERROR",
    errors,
  });
}

export function toApiErrorPayload(
  error: unknown
): ApiErrorPayload {
  const normalized = normalizeApiError(error);

  return {
    success: false,
    message: normalized.message,
    statusCode: normalized.statusCode,
    code: normalized.code,
    errors: normalized.errors,
    isNetworkError: normalized.isNetworkError,
    isTimeout: normalized.isTimeout,
  };
}
