import axiosInstance from "../../services/api/axiosInstance";
import type { ApiResponse } from "../../types/api.types";
import type {
  AboutInput,
  CertificationInput,
  EducationInput,
  ExperienceInput,
  ProfileIntroduction,
  ProfileResponse,
  SocialLinkInput,
} from "./profile.types";

const basePath = "/developer/profile";

export const profileService = {
  async geProfile(userId: string) {
    const response = await axiosInstance.get<ApiResponse<ProfileResponse>>(
      `/profile/${userId}`,
    );
    return response.data;
  },
  async getMyProfile() {
    const response = await axiosInstance.get<ApiResponse<ProfileResponse>>(
      `${basePath}/me`,
    );
    return response.data;
  },
  async getPublicProfile(userId: string) {
    const response = await axiosInstance.get<ApiResponse<ProfileResponse>>(
      `${basePath}/${userId}`,
    );
    return response.data;
  },
  async createProfile(input: Record<string, unknown>) {
    const response = await axiosInstance.post<ApiResponse<ProfileResponse>>(
      basePath,
      input,
    );
    return response.data;
  },
  async updateIntroduction(input: Partial<ProfileIntroduction>) {
    const response = await axiosInstance.patch<ApiResponse<ProfileResponse>>(
      `${basePath}/introduction`,
      input,
    );
    return response.data;
  },
  async updateAbout(input: AboutInput) {
    const response = await axiosInstance.patch<ApiResponse<ProfileResponse>>(
      `${basePath}/about`,
      input,
    );
    return response.data;
  },
  async updateSkills(skills: string[]) {
    const response = await axiosInstance.patch<ApiResponse<ProfileResponse>>(
      `${basePath}/skills`,
      { skills },
    );
    return response.data;
  },
  async updateSocialLinks(socialLinks: SocialLinkInput[]) {
    const response = await axiosInstance.patch<ApiResponse<ProfileResponse>>(
      `${basePath}/social-links`,
      { socialLinks },
    );
    return response.data;
  },
  async addEducation(input: EducationInput) {
    const response = await axiosInstance.post<ApiResponse<ProfileResponse>>(
      `${basePath}/education`,
      input,
    );
    return response.data;
  },
  async updateEducation(id: string, input: Partial<EducationInput>) {
    const response = await axiosInstance.patch<ApiResponse<ProfileResponse>>(
      `${basePath}/education/${id}`,
      input,
    );
    return response.data;
  },
  async deleteEducation(id: string) {
    const response = await axiosInstance.delete<ApiResponse<ProfileResponse>>(
      `${basePath}/education/${id}`,
    );
    return response.data;
  },
  async addExperience(input: ExperienceInput) {
    const response = await axiosInstance.post<ApiResponse<ProfileResponse>>(
      `${basePath}/experience`,
      input,
    );
    return response.data;
  },
  async updateExperience(id: string, input: Partial<ExperienceInput>) {
    const response = await axiosInstance.patch<ApiResponse<ProfileResponse>>(
      `${basePath}/experience/${id}`,
      input,
    );
    return response.data;
  },
  async deleteExperience(id: string) {
    const response = await axiosInstance.delete<ApiResponse<ProfileResponse>>(
      `${basePath}/experience/${id}`,
    );
    return response.data;
  },
  async addCertification(input: CertificationInput) {
    const response = await axiosInstance.post<ApiResponse<ProfileResponse>>(
      `${basePath}/certifications`,
      input,
    );
    return response.data;
  },
  async updateCertification(id: string, input: Partial<CertificationInput>) {
    const response = await axiosInstance.patch<ApiResponse<ProfileResponse>>(
      `${basePath}/certifications/${id}`,
      input,
    );
    return response.data;
  },
  async deleteCertification(id: string) {
    const response = await axiosInstance.delete<ApiResponse<ProfileResponse>>(
      `${basePath}/certifications/${id}`,
    );
    return response.data;
  },
};
