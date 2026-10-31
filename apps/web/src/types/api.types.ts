// types/api.types.ts

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  code?: string;
  data: T;
}

export interface ApiFieldError {
  field?: string;
  message: string;
}

export interface ApiErrorPayload {
  success: false;
  message: string;
  statusCode?: number;
  code?: string;
  errors?: ApiFieldError[];
  isNetworkError?: boolean;
  isTimeout?: boolean;
}
