import type { RootState } from "../../app/store";

export const selectProfileState = (state: RootState) => state.profile;

export const selectProfile = (state: RootState) => state.profile.profile;
export const selectProfileFetchStatus = (state: RootState) =>
  state.profile.fetchStatus;
export const selectProfileMutationStatus = (state: RootState) =>
  state.profile.mutationStatus;
export const selectProfileError = (state: RootState) => state.profile.error;
