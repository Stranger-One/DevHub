import {
  createSlice,
  type PayloadAction,
  type UnknownAction,
} from "@reduxjs/toolkit";
import { toast } from "sonner";
import type { ApiErrorPayload, ApiResponse } from "../../types/api.types";
import {
  fetchProfile,
} from "./profileThunk";
import type {
  DeveloperProfile,
  ProfileResponse,
  ProfileState,
} from "./profile.types";

const initialState: ProfileState = {
  profile: null,
  fetchStatus: "idle",
  mutationStatus: "idle",
  error: null,
};
const mutationPrefixes = [
  "profile/create",
  "profile/updateIntroduction",
  "profile/updateAbout",
  "profile/updateSkills",
  "profile/updateSocialLinks",
  "profile/addEducation",
  "profile/updateEducation",
  "profile/deleteEducation",
  "profile/addExperience",
  "profile/updateExperience",
  "profile/deleteExperience",
  "profile/addCertification",
  "profile/updateCertification",
  "profile/deleteCertification",
];

const getError = (action: {
  payload?: ApiErrorPayload;
  error: { message?: string };
}) =>
  action.payload?.message ?? action.error.message ?? "Profile request failed.";
const setProfile = (state: ProfileState, profile: DeveloperProfile) => {
  state.profile = profile;
};
const isMutationAction = (action: UnknownAction) =>
  mutationPrefixes.some((prefix) => action.type.startsWith(`${prefix}/`));

// =====================
// Profile Slice
// =====================
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError(state) {
      state.error = null;
    },
    resetProfileState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.fetchStatus = "loading";
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.error = null;
        const profile = action.payload.profile;
        if (profile) setProfile(state, profile);
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = getError(action);
        toast.error(state.error);
      });
    builder.addMatcher(
      (action): action is UnknownAction & { type: string } =>
        isMutationAction(action) && action.type.endsWith("/pending"),
      (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      },
    );
    builder.addMatcher(
      (action): action is PayloadAction<ApiResponse<ProfileResponse>> =>
        isMutationAction(action) && action.type.endsWith("/fulfilled"),
      (state, action) => {
        state.mutationStatus = "succeeded";
        state.error = null;
        const profile = action.payload.data.profile;
        if (profile) setProfile(state, profile);
        toast.success(action.payload.message ?? "Profile updated");
      },
    );
    builder.addMatcher(
      (
        action,
      ): action is PayloadAction<ApiErrorPayload> & {
        error: { message?: string };
      } => isMutationAction(action) && action.type.endsWith("/rejected"),
      (state, action) => {
        state.mutationStatus = "failed";
        state.error = getError(action);
        toast.error(state.error);
      },
    );
  },
});

export const { clearProfileError, resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;
