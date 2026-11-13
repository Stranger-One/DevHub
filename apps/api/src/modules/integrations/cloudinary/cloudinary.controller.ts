import type { Request, Response } from "express";
import cloudinary from "../../../config/cloudinary.js";

export const generateUploadSignature = async (req: Request, res: Response) => {
  try {
    const timestamp = Math.round(Date.now() / 1000);

    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET!;

    // These are the exact parameters we authorize.
    const paramsToSign = {
      timestamp,
      upload_preset: uploadPreset,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!,
    );

    return res.status(200).json({
      success: true,
      data: {
        timestamp,
        signature,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        uploadPreset,
      },
    });
  } catch (error) {
    console.error("Signature generation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to generate upload signature",
    });
  }
};
