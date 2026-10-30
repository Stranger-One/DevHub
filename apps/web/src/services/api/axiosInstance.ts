import axios from "axios";

import { env } from "../../config/env";
import { setupInterceptors } from "./interceptors";

const axiosInstance = axios.create({
  baseURL: env.API_BASE_URL,

  timeout: 15000,

  withCredentials: true,

  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

// Register interceptors once when the module initializes.
setupInterceptors(axiosInstance);

export default axiosInstance;
