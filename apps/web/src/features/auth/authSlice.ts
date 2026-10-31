import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "../../types/auth.types";
import {
  loginUser,
  verifyEmail,
  fetchCurrentUser,
  logoutUser,
} from "./authThunk";
import { toast } from "sonner";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    resetAuthState(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
        toast.success("Logged in successfully!", {
          description: `Welcome back, ${action.payload.username}!`,
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload?.message ?? action.error.message ?? "Login failed.";
      });

    // REGISTER
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload?.message ??
          action.error.message ??
          "Registration failed.";
      });

    // FETCH CURRENT USER
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload?.message ??
          action.error.message ??
          "Unable to fetch user.";
      });

    // LOGOUT
    builder
      .addCase(logoutUser.pending, (state) => {
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = "idle";
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error =
          action.payload?.message ?? action.error.message ?? "Logout failed.";
      });
  },
});

export const { clearAuthError, resetAuthState } = authSlice.actions;

export default authSlice.reducer;
// export const authReducer = authSlice.reducer;
