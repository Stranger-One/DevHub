import type { ApiErrorPayload } from "../../types/api.types";

import { notificationService } from "./notificationService";

const ERROR_MESSAGES_BY_CODE: Record<string, string> = {
  AUTH_INVALID_CREDENTIALS: "Invalid email or password",
};

export function handleApiError(error: ApiErrorPayload) {
  if (typeof error !== "object" || error === null) {
    notificationService.error("Something went wrong.");
    return;
  }

  const apiError = error 

  if (apiError.isNetworkError) {
    notificationService.error(
      "Unable to connect to the server. Check your internet connection.",
    );
    return;
  }

  // Timeout
  if (apiError.isTimeout) {
    notificationService.error("Request timed out. Please try again.");
    return;
  }

  if (apiError.errors?.length) {
    for (const fieldError of apiError.errors) {
      notificationService.error(apiError.message, {
        description: fieldError.message,
      });
    }
    return;
  }

  const message =
    (apiError.code && ERROR_MESSAGES_BY_CODE[apiError.code]) ??
    apiError.message ??
    "Something went wrong.";

  notificationService.error(message, {
    description: apiError.description,
  });
}
