import type { ApiErrorPayload } from "../../types/api.types";

import { notificationService } from "./notificationService";

export function handleApiError(error: unknown) {
  if (typeof error !== "object" || error === null) {
    notificationService.error("Something went wrong.");
    return;
  }

  const apiError = error as Partial<ApiErrorPayload>;

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
      notificationService.error(fieldError.message, {
        description: fieldError.field || apiError.description,
      });
    }
    return;
  }

  notificationService.error(apiError.message ?? "Something went wrong.", {
    description: apiError.description,
  });
}
