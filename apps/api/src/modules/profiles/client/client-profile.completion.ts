import {
  calculateProfileCompletion,
  type CompletionRule,
} from "../profile-completion.utils.js";
import type { ClientProfileDocument } from "./client-profile.model.js";

interface ClientProfileData {
  clientType: "individual" | "company";

  personalInformation?: {
    displayName?: string;
    bio?: string;
    avatar?: {
      url?: string;
      publicId?: string;
    };
  };

  businessInformation?: {
    companyName?: string;
    description?: string;
    logo?: {
      url?: string;
      publicId?: string;
    };
  };

  location?: {
    country?: string;
    state?: string;
    city?: string;
  };

  contactInformation?: {
    businessEmail?: string;
  };

  hiringPreferences?: {
    hiringCategories?: string[];
  };
}

export const calculateClientCompletion = (profile: ClientProfileDocument) => {
  const isCompany = profile.clientType === "company";

  const rules: CompletionRule[] = [
    {
      key: "personalInformation",
      label: "Personal Information",
      weight: 20,
      completed: Boolean(
        profile.personalInformation?.displayName?.trim() &&
        profile.personalInformation?.bio?.trim(),
      ),
    },
    {
      key: "businessInformation",
      label: "Business Information",
      weight: 25,
      completed: isCompany
        ? Boolean(
            profile.businessInformation?.companyName?.trim() &&
            profile.businessInformation?.description?.trim(),
          )
        : true,
    },
    {
      key: "location",
      label: "Location",
      weight: 15,
      completed: Boolean(
        profile.location?.country?.trim() &&
        profile.location?.state?.trim() &&
        profile.location?.city?.trim(),
      ),
    },
    {
      key: "contactInformation",
      label: "Contact Information",
      weight: 15,
      completed: Boolean(profile.contactInformation?.businessEmail?.trim()),
    },
    {
      key: "hiringPreferences",
      label: "Hiring Preferences",
      weight: 15,
      completed: (profile.hiringPreferences?.hiringCategories?.length ?? 0) > 0,
    },
    {
      key: "profileMedia",
      label: "Profile Media",
      weight: 10,
      completed: isCompany
        ? Boolean(profile.businessInformation?.logo?.url)
        : Boolean(profile.personalInformation?.avatar?.url),
    },
  ];

  return calculateProfileCompletion(rules);
};
