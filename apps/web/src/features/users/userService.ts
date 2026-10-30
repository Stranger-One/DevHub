import axiosInstance from "../../services/api/axiosInstance";
import type { ApiResponse } from "../../types/api.types";
import type { AuthUser } from "../../types/auth.types";

export const userService = {
  async getCurrentUser() {
    const response =
      await axiosInstance.get<ApiResponse<AuthUser>>("/users/me");

    return response.data;
  },
};
