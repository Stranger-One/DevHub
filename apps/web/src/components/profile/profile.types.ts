export type ProfileMedia = {
  url: string;
  publicId?: string;
  type?: string;
  title?: string;
  description?: string;
};

export type ProfileIntroduction = {
  profilePicture: ProfileMedia;
  coverImage: ProfileMedia;
  location: {
    country: string;
    state: string;
    city: string;
    postalCode?: string;
  };
  firstName: string;
  lastName: string;
  pronouns: string;
  headline: string;
};

export type ProfileEducation = {
  _id: string;
  institution: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  currentlyStudying: boolean;
  description?: string;
};

export type ProfileExperience = {
  _id: string;
  company: string;
  position: string;
  employmentType?:
    | "full-time"
    | "part-time"
    | "contract"
    | "freelance"
    | "internship";
  location?: string;
  workingType?: "remote" | "on-site" | "hybrid";
  startDate?: string;
  endDate?: string;
  currentlyWorking: boolean;
  description: string;
  skills: string[];
};

export type ProfileCertification = {
  _id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  doesNotExpire: boolean;
  credentialId?: string;
  credentialUrl?: string;
  skills: string[];
  media: ProfileMedia[];
};

export type DeveloperProfile = {
  _id: string;
  userId: string;
  introduction: ProfileIntroduction;
  about: {
    description: string;
    specialties: string[];
  };
  skills: string[];
  education: ProfileEducation[];
  experience: ProfileExperience[];
  certifications: ProfileCertification[];
  socialLinks: { _id: string; platform: string; label: string; url: string }[];
  completionPercentage: number;
};
