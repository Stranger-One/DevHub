import {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { normalizeApiError } from "./errorNormalizer";
import axiosInstance from "./axiosInstance";
import { handleApiError } from "../notification/handleApiError";

let refreshPromise: Promise<void> | null = null;

function handleRequest(config: InternalAxiosRequestConfig) {
  // Common request configuration can be added here.
  // Authentication uses HTTP-only cookies,
  // so we do not manually attach access tokens.

  return config;
}

function handleRequestError(error: unknown) {
  const normalizedError = normalizeApiError(error);
  handleApiError(normalizedError);
  return Promise.reject(normalizedError);
}

function handleResponse(response: AxiosResponse) {
  return response;
}

async function handleResponseError(error: AxiosError) {
  const originalRequest = error.config;

  // Only handle HTTP 401 errors.
  if (
    error.response?.status !== 401 ||
    !originalRequest ||
    originalRequest.skipAuthRefresh ||
    originalRequest._retry
  ) {
    const normalizedError = normalizeApiError(error);
    handleApiError(normalizedError);
    return Promise.reject(normalizedError);
  }

  // Mark this request as already retried.
  originalRequest._retry = true;

  try {
    // If refresh is already running, reuse its promise.
    if (!refreshPromise) {
      refreshPromise = axiosInstance
        .post("/auth/refresh", {}, { skipAuthRefresh: true })
        .then(() => undefined)
        .finally(() => {
          refreshPromise = null;
        });
    }

    // Wait for refresh to complete.
    await refreshPromise;

    // Retry the original request with the new cookie.
    return axiosInstance(originalRequest);
  } catch (refreshError) {
    refreshPromise = null;

    const normalizedError = normalizeApiError(refreshError);
    handleApiError(normalizedError);
    return Promise.reject(normalizedError);
  }
}

export function setupInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use(handleRequest, handleRequestError);

  instance.interceptors.response.use(handleResponse, handleResponseError);
}
