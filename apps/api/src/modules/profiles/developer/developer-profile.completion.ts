import {
  calculateProfileCompletion,
  type CompletionRule,
} from "../profile-completion.utils.js";
import { DeveloperProfileDocument } from "./developer-profile.model.js";

interface DeveloperProfileData {
  personalInformation?: {
    displayName?: string;
    headline?: string;
    bio?: string;
  };

  professionalInformation?: {
    experienceLevel?: string;
    specialization?: string;
  };

  skills?: string[];

  education?: unknown[];

  experience?: unknown[];

  location?: {
    country?: string;
    state?: string;
    city?: string;
  };

  socialLinks?: {
    github?: string;
    linkedin?: string;
  };

  careerPreferences?: {
    opportunityTypes?: string[];
  };
}

export const calculateDeveloperCompletion = (profile: DeveloperProfileDocument) => {
  const rules: CompletionRule[] = [
    {
      key: "personalInformation",
      label: "Personal Information",
      weight: 20,
      completed: Boolean(
        profile.personalInformation?.displayName?.trim() &&
        profile.personalInformation?.headline?.trim() &&
        profile.personalInformation?.bio?.trim(),
      ),
    },
    {
      key: "professionalInformation",
      label: "Professional Information",
      weight: 15,
      completed: Boolean(
        profile.professionalInformation?.experienceLevel &&
        profile.professionalInformation?.specialization?.trim(),
      ),
    },
    {
      key: "skills",
      label: "Skills",
      weight: 20,
      completed: (profile.skills?.length ?? 0) >= 3,
    },
    {
      key: "education",
      label: "Education",
      weight: 15,
      completed: (profile.education?.length ?? 0) >= 1,
    },
    {
      key: "experience",
      label: "Experience",
      weight: 15,
      completed: (profile.experience?.length ?? 0) >= 1,
    },
    {
      key: "location",
      label: "Location",
      weight: 5,
      completed: Boolean(
        profile.location?.country?.trim() &&
        profile.location?.state?.trim() &&
        profile.location?.city?.trim(),
      ),
    },
    {
      key: "socialLinks",
      label: "Social Links",
      weight: 5,
      completed: Boolean(
        profile.socialLinks?.github || profile.socialLinks?.linkedin,
      ),
    },
    {
      key: "careerPreferences",
      label: "Career Preferences",
      weight: 5,
      completed: (profile.careerPreferences?.opportunityTypes?.length ?? 0) > 0,
    },
  ];

  return calculateProfileCompletion(rules);
};
