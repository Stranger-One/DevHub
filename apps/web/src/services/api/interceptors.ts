import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { normalizeApiError } from "./errorNormalizer";

function handleRequest(config: InternalAxiosRequestConfig) {
  // Common request configuration can be added here.
  // Authentication uses HTTP-only cookies,
  // so we do not manually attach access tokens.

  return config;
}

function handleRequestError(error: unknown) {
  return Promise.reject(error);
}

function handleResponse(response: AxiosResponse): AxiosResponse {
  return response;
}

function handleResponseError(error: unknown) {
  // Keep cancellations distinguishable from API failures.
  if (axios.isCancel(error)) {
    return Promise.reject(error);
  }

  return Promise.reject(normalizeApiError(error));
}

export function setupInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use(handleRequest, handleRequestError);

  instance.interceptors.response.use(handleResponse, handleResponseError);
}
