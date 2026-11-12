import type { RootState } from "../../app/store";

export const selectProfileState = (state: RootState) => state.profile;
export const selectCurrentProfile = (state: RootState) => state.profile.current;
export const selectPublicProfile = (userId: string) => (state: RootState) =>
  state.profile.publicProfiles[userId] ?? null;
export const selectProfileFetchStatus = (state: RootState) =>
  state.profile.fetchStatus;
export const selectProfileMutationStatus = (state: RootState) =>
  state.profile.mutationStatus;
export const selectProfileError = (state: RootState) => state.profile.error;
