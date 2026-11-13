import axios from "axios";
import type {
  ResourceType,
  UploadSignature,
  CloudinaryUploadResult,
} from "../../types/upload.types";
import axiosInstance from "../api/axiosInstance";
import { ApiError } from "../api/apiError";

// Get signature from our backend
const getUploadSignature = async (): Promise<UploadSignature> => {
  try {
    const response = await axiosInstance.get("/uploads/signature");
    console.log("Upload Signature Response: ", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching upload signature:", error);
    throw new ApiError({
      message: "Failed to fetch upload signature",
    });
  }
};

// Upload media directly to Cloudinary
export const uploadMedia = async (
  file: File,
  resourceType: ResourceType = "auto",
  onProgress?: (progress: number) => void,
): Promise<CloudinaryUploadResult> => {
  // 1. Validate file
  if (!file) {
    throw new Error("Please select a file");
  }

  // 2. Get signature
  const auth = await getUploadSignature();

  // 3. Create FormData
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", auth.apiKey);
  formData.append("timestamp", String(auth.timestamp));
  formData.append("signature", auth.signature);
  formData.append("upload_preset", auth.uploadPreset);

  // 4. Cloudinary upload URL
  const uploadUrl = `https://api.cloudinary.com/v1_1/${auth.cloudName}/${resourceType}/upload`;
  console.log("Cloudinary Upload URL: ", uploadUrl);

  // 5. Upload file
  const response = await axios.post<CloudinaryUploadResult>(
    uploadUrl,
    formData,
    {
      onUploadProgress: (event) => {
        if (event.total && onProgress) {
          const progress = Math.round((event.loaded * 100) / event.total);

          onProgress(progress);
        }
      },
    },
  );

  const result = {
    asset_id: response.data.asset_id,
    public_id: response.data.public_id,
    secure_url: response.data.secure_url,
    resource_type: response.data.resource_type,
    format: response.data.format,
    bytes: response.data.bytes,
  };

  // 6. Return Cloudinary response
  console.log("Cloudinary Response: ", result);
  return result;
};
