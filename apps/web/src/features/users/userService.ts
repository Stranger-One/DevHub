import axiosInstance from "../../services/api/axiosInstance";
import type { ApiResponse } from "../../types/api.types";
import type { User } from "../../types/auth.types";

export const userService = {
  async getCurrentUser() {
    const response = await axiosInstance.get<ApiResponse<User>>("/users/me");

    return response.data;
  },
};
