import { z } from "zod";
import { USER_ROLES } from "../users/user.model.js";

const emailSchema = z
  .string()
  .trim()
  .email()
  .max(254)
  .transform((value) => value.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(128)
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[0-9]/, "Password must contain a number")
  .regex(/[^a-zA-Z0-9]/, "Password must contain a special character");

const otpSchema = z
  .string()
  .regex(/^\d{6}$/, "OTP must contain exactly 6 digits");

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const completeRegistrationSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_]+$/),
  role: z.enum(USER_ROLES),
});

export const resendRegistrationOtpSchema = z.object({
  email: emailSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const verifyResetOtpSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

export const resetPasswordSchema = z.object({
  resetToken: z.string().min(1),
  newPassword: passwordSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: passwordSchema,
});

export const verifyEmailOtpSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

export const emailChangeSchema = z.object({
  newEmail: emailSchema,
});

export const revokeSessionSchema = z.object({
  sessionId: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type CompleteRegistrationInput = z.infer<
  typeof completeRegistrationSchema
>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type VerifyResetOtpInput = z.infer<typeof verifyResetOtpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
