import axiosInstance from "../../services/api/axiosInstance";

import type { ApiResponse } from "../../types/api.types";
import type { LoginCredentials, User, VerifyEmailCredentials } from "../../types/auth.types";


interface AuthResponse {
  user: User;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      credentials,
    );

    return response.data;
  },

  async refresh() {
    const response = await axiosInstance.post(
      "/auth/refresh",
      {},
      {
        skipAuthRefresh: true,
      },
    );

    return response.data;
  },

  async verifyEmail(credentials: VerifyEmailCredentials) {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      "/auth/register/verify-otp",
      credentials,
    );

    return response.data;
  },

  async getCurrentUser() {
    const response =
      await axiosInstance.get<ApiResponse<AuthResponse>>("/auth/me");

    return response.data;
  },

  async logout() {
    const response =
      await axiosInstance.post<ApiResponse<null>>("/auth/logout");

    return response.data;
  },
};
