export type UserRole = 'developer' | 'client';

export interface UserProfile {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  emailVerified: boolean;
  profile?: UserProfile;
}

// Adapt this to the exact response envelope returned by your Express API.
export interface CurrentUserResponse {
  user: AuthUser;
}
