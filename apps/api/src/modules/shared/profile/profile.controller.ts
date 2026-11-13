import { NextFunction, Request, Response } from "express";
import { getProfileById } from "./profile.service.js";


export const getProfileByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id  =  req.params.userId as string
    const profile = await getProfileById(id);
    
    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: {
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};
