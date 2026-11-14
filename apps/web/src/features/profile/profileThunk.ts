import { createAsyncThunk } from "@reduxjs/toolkit";
import { logger } from "../../services/logger/logger";
import { toApiErrorPayload } from "../../services/api/errorNormalizer";
import type { ApiErrorPayload } from "../../types/api.types";
import { profileService } from "./profileService";
import type {
  AboutInput,
  CertificationInput,
  EducationInput,
  ExperienceInput,
  ProfileIntroduction,
  SocialLinkInput,
} from "./profile.types";
import type { DeveloperProfile } from "./profile.types";

type ThunkConfig = { rejectValue: ApiErrorPayload };

const withError = async <T>(
  request: () => Promise<T>,
  rejectWithValue: (value: ApiErrorPayload) => unknown,
): Promise<T> => {
  try {
    return await request();
  } catch (error) {
    logger.error("Profile request failed", error);
    return rejectWithValue(toApiErrorPayload(error)) as T;
  }
};

export const fetchProfile = createAsyncThunk<
  { userId: string; profile: DeveloperProfile },
  string,
  ThunkConfig
>("profile/fetchProfile", async (userId, { rejectWithValue }) =>
  withError(
    async () => ({
      userId,
      profile: (await profileService.geProfile(userId)).data.profile,
    }),
    rejectWithValue,
  ),
);

// export const fetchMyProfile = createAsyncThunk<
//   Awaited<ReturnType<typeof profileService.getMyProfile>>,
//   void,
//   ThunkConfig
// >("profile/fetchMyProfile", async (_, { rejectWithValue }) =>
//   withError(() => profileService.getMyProfile(), rejectWithValue),
// );

// export const fetchPublicProfile = createAsyncThunk<
//   { userId: string; profile: DeveloperProfile },
//   string,
//   ThunkConfig
// >("profile/fetchPublicProfile", async (userId, { rejectWithValue }) =>
//   withError(
//     async () => ({
//       userId,
//       profile: (await profileService.getPublicProfile(userId)).data.profile,
//     }),
//     rejectWithValue,
//   ),
// );

// export const createProfile = createAsyncThunk<
//   ReturnType<typeof profileService.createProfile> extends Promise<infer T>
//     ? T
//     : never,
//   Record<string, unknown>,
//   ThunkConfig
// >("profile/create", async (input, { rejectWithValue }) =>
//   withError(() => profileService.createProfile(input), rejectWithValue),
// );

export const updateIntroduction = createAsyncThunk<
  ReturnType<typeof profileService.updateIntroduction> extends Promise<infer T>
    ? T
    : never,
  Partial<ProfileIntroduction>,
  ThunkConfig
>("profile/updateIntroduction", async (input, { rejectWithValue }) =>
  withError(() => profileService.updateIntroduction(input), rejectWithValue),
);
export const updateAbout = createAsyncThunk<
  ReturnType<typeof profileService.updateAbout> extends Promise<infer T>
    ? T
    : never,
  AboutInput,
  ThunkConfig
>("profile/updateAbout", async (input, { rejectWithValue }) =>
  withError(() => profileService.updateAbout(input), rejectWithValue),
);
export const updateSkills = createAsyncThunk<
  ReturnType<typeof profileService.updateSkills> extends Promise<infer T>
    ? T
    : never,
  string[],
  ThunkConfig
>("profile/updateSkills", async (input, { rejectWithValue }) =>
  withError(() => profileService.updateSkills(input), rejectWithValue),
);

export const addSocialLink = createAsyncThunk<
  ReturnType<typeof profileService.addSocialLink> extends Promise<infer T>
    ? T
    : never,
  SocialLinkInput,
  ThunkConfig
>("profile/addSocialLink", async (input, { rejectWithValue }) =>
  withError(() => profileService.addSocialLink(input), rejectWithValue),
);
export const updateSocialLink = createAsyncThunk<
  ReturnType<typeof profileService.updateSocialLink> extends Promise<infer T>
    ? T
    : never,
  { id: string; input: Partial<SocialLinkInput> },
  ThunkConfig
>("profile/updateSocialLink", async ({ id, input }, { rejectWithValue }) =>
  withError(() => profileService.updateSocialLink(id, input), rejectWithValue),
);
export const deleteSocialLink = createAsyncThunk<
  ReturnType<typeof profileService.deleteSocialLink> extends Promise<infer T>
    ? T
    : never,
  string,
  ThunkConfig
>("profile/deleteSocialLink", async (id, { rejectWithValue }) =>
  withError(() => profileService.deleteSocialLink(id), rejectWithValue),
);

export const addEducation = createAsyncThunk<
  ReturnType<typeof profileService.addEducation> extends Promise<infer T>
    ? T
    : never,
  EducationInput,
  ThunkConfig
>("profile/addEducation", async (input, { rejectWithValue }) =>
  withError(() => profileService.addEducation(input), rejectWithValue),
);
export const updateEducation = createAsyncThunk<
  ReturnType<typeof profileService.updateEducation> extends Promise<infer T>
    ? T
    : never,
  { id: string; input: Partial<EducationInput> },
  ThunkConfig
>("profile/updateEducation", async ({ id, input }, { rejectWithValue }) =>
  withError(() => profileService.updateEducation(id, input), rejectWithValue),
);
export const deleteEducation = createAsyncThunk<
  ReturnType<typeof profileService.deleteEducation> extends Promise<infer T>
    ? T
    : never,
  string,
  ThunkConfig
>("profile/deleteEducation", async (id, { rejectWithValue }) =>
  withError(() => profileService.deleteEducation(id), rejectWithValue),
);

export const addExperience = createAsyncThunk<
  ReturnType<typeof profileService.addExperience> extends Promise<infer T>
    ? T
    : never,
  ExperienceInput,
  ThunkConfig
>("profile/addExperience", async (input, { rejectWithValue }) =>
  withError(() => profileService.addExperience(input), rejectWithValue),
);
export const updateExperience = createAsyncThunk<
  ReturnType<typeof profileService.updateExperience> extends Promise<infer T>
    ? T
    : never,
  { id: string; input: Partial<ExperienceInput> },
  ThunkConfig
>("profile/updateExperience", async ({ id, input }, { rejectWithValue }) =>
  withError(() => profileService.updateExperience(id, input), rejectWithValue),
);
export const deleteExperience = createAsyncThunk<
  ReturnType<typeof profileService.deleteExperience> extends Promise<infer T>
    ? T
    : never,
  string,
  ThunkConfig
>("profile/deleteExperience", async (id, { rejectWithValue }) =>
  withError(() => profileService.deleteExperience(id), rejectWithValue),
);

export const addCertification = createAsyncThunk<
  ReturnType<typeof profileService.addCertification> extends Promise<infer T>
    ? T
    : never,
  CertificationInput,
  ThunkConfig
>("profile/addCertification", async (input, { rejectWithValue }) =>
  withError(() => profileService.addCertification(input), rejectWithValue),
);
export const updateCertification = createAsyncThunk<
  ReturnType<typeof profileService.updateCertification> extends Promise<infer T>
    ? T
    : never,
  { id: string; input: Partial<CertificationInput> },
  ThunkConfig
>("profile/updateCertification", async ({ id, input }, { rejectWithValue }) =>
  withError(
    () => profileService.updateCertification(id, input),
    rejectWithValue,
  ),
);
export const deleteCertification = createAsyncThunk<
  ReturnType<typeof profileService.deleteCertification> extends Promise<infer T>
    ? T
    : never,
  string,
  ThunkConfig
>("profile/deleteCertification", async (id, { rejectWithValue }) =>
  withError(() => profileService.deleteCertification(id), rejectWithValue),
);
