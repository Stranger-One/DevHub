export type ResourceType = "image" | "video" | "raw" | "auto";

export interface UploadSignature {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  uploadPreset: string;
}

export interface CloudinaryUploadResult {
  asset_id: string;
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
}
