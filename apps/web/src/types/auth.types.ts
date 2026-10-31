export type UserRole = "developer" | "client";

export interface UserProfile {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  emailVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
