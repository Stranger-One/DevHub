import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "../../types/auth.types";

export type AuthStatus = "checking" | "authenticated" | "unauthenticated";

interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
}

const developerUser: AuthUser = {
  id: "1234567890",
  email: "developer@example.com",
  username: "developer",
  role: "developer",
  emailVerified: true,
};

const clientUser: AuthUser = {
  id: "0987654321",
  email: "client@example.com",
  username: "client",
  role: "client",
  emailVerified: true,
};

const initialState: AuthState = {
  user: null,
  status: "unauthenticated",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.status = "authenticated";
    },
    setUnauthenticated(state) {
      state.user = null;
      state.status = "unauthenticated";
    },
  },
});

export const { setAuthenticated, setUnauthenticated } = authSlice.actions;
export const authReducer = authSlice.reducer;
