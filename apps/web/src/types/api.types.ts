export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  code?: string;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}
