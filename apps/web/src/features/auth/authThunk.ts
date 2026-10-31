import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "./authService";
import type {
  LoginCredentials,
  RegisterCredentials,
  User,
  VerifyEmailCredentials,
} from "../../types/auth.types";
import type { ApiErrorPayload } from "../../types/api.types";
import { toApiErrorPayload } from "../../services/api/errorNormalizer";

// LOGIN
export const loginUser = createAsyncThunk<
  User,
  LoginCredentials,
  { rejectValue: ApiErrorPayload }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.login(credentials);

    return response.data.user;
  } catch (error) {
    return rejectWithValue(toApiErrorPayload(error));
  }
});


// REGISTER
export const verifyEmail = createAsyncThunk<
  User,
  VerifyEmailCredentials,
  { rejectValue: ApiErrorPayload }
>("auth/verifyEmail", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.verifyEmail(credentials);

    return response.data.user;
  } catch (error) {
    return rejectWithValue(toApiErrorPayload(error));
  }
});

// FETCH CURRENT USER
export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: ApiErrorPayload }
>("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await authService.getCurrentUser();

    return response.data.user;
  } catch (error) {
    return rejectWithValue(toApiErrorPayload(error));
  }
});

// LOGOUT
export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: ApiErrorPayload }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
  } catch (error) {
    return rejectWithValue(toApiErrorPayload(error));
  }
});
