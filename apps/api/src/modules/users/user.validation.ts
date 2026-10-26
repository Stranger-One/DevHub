import z from "zod";

export const registerUserSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Please provide a valid email address")
      .max(254, "Email must not exceed 254 characters")
      .transform((email) => email.toLowerCase()),
    username: z
      .string()
      .trim()
      .min(3, "Username must contain at least 3 characters")
      .max(30, "Username must not exceed 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can contain only letters, numbers, and underscores",
      )
      .transform((username) => username.toLowerCase()),
    password: z
      .string()
      .min(8, "Password must contain at least 8 characters")
      .max(128, "Password must not exceed 128 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),

    role: z.enum(["DEVELOPER", "CLIENT"]),
  })
  .strict();

export const loginUserSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Please provide a valid email address")
      .max(254, "Email must not exceed 254 characters")
      .transform((email) => email.toLowerCase()),
    password: z
      .string()
      .min(1, "Password must contain at least 1 characters")
      .max(128, "Password must not exceed 128 characters"),
  })
  .strict();

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
