import mongoose from "mongoose";
import { ApiError } from "../errors/api-error.js";
import { ErrorCode } from "../errors/error-code.js";

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new ApiError("Database configuration is incomplete", 500, {
      code: ErrorCode.CONFIGURATION_ERROR,
      description: "The database connection is not configured.",
    });
  }

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error.message);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10_000,
    maxPoolSize: 10,
    minPoolSize: 0,
  });

  console.log("MongoDB Connected Successfully");
}
