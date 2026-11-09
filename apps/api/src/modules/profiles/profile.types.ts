import { Types } from "mongoose";

// Profile visibility
export const PROFILE_VISIBILITIES = ["public", "private"] as const;
export type ProfileVisibility = (typeof PROFILE_VISIBILITIES)[number];

// Persisted profile onboarding states.
// "not_started" is derived when no profile document exists.
export const ONBOARDING_STATUSES = ["in_progress", "completed"] as const;
export type OnboardingStatus = (typeof ONBOARDING_STATUSES)[number];

// Developer career preferences
export const DEVELOPER_OPPORTUNITY_TYPES = [
  "internship",
  "full_time",
  "part_time",
  "freelance",
] as const;
export type DeveloperOpportunityType =
  (typeof DEVELOPER_OPPORTUNITY_TYPES)[number];

// Developer availability
export const AVAILABILITY_STATUSES = [
  "available",
  "busy",
  "unavailable",
] as const;
export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];

// Client account types
export const CLIENT_TYPES = ["individual", "company"] as const;
export type ClientType = (typeof CLIENT_TYPES)[number];

// Client verification states
export const CLIENT_VERIFICATION_STATUSES = [
  "not_required",
  "not_submitted",
  "pending",
  "verified",
  "rejected",
] as const;
export type ClientVerificationStatus =
  (typeof CLIENT_VERIFICATION_STATUSES)[number];

// Media metadata stored for Cloudinary assets
export interface MediaAsset {
  url: string;
  publicId: string;
}

// Structured location
export interface ProfileLocation {
  country?: string;
  state?: string;
  city?: string;
}

// Common onboarding information
export interface ProfileOnboarding {
  status: OnboardingStatus;
  currentStep?: string;
}

// Common profile reference
export interface ProfileBase {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  visibility: ProfileVisibility;
  createdAt: Date;
  updatedAt: Date;
}
