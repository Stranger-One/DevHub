import type {
  DeveloperProfile,
  ProfileCertification,
  ProfileEducation,
  ProfileExperience,
  ProfileIntroduction,
} from "../../components/profile/profile.types";

export type {
  DeveloperProfile,
  ProfileCertification,
  ProfileEducation,
  ProfileExperience,
  ProfileIntroduction,
};

export type AboutInput = {
  description?: string;
  specialties?: string[];
};

export type EducationInput = Omit<ProfileEducation, "_id">;
export type ExperienceInput = Omit<ProfileExperience, "_id">;
export type CertificationInput = Omit<ProfileCertification, "_id">;

export type SocialLinkInput = {
  platform: string;
  label?: string;
  url: string;
};

export type ProfileState = {
  profile: DeveloperProfile | null;
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  mutationStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

export type ProfileResponse = { profile: DeveloperProfile };
