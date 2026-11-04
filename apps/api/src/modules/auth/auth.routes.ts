import { Router } from "express";
import {
  register,
  resendRegistrationOtp,
  completeRegistration,
} from "./controllers/registration.controller.js";
import {
  completeRegistrationSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendRegistrationOtpSchema,
  resetPasswordSchema,
} from "./auth.validation.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  forgotPassword,
  getMe,
  login,
  logout,
  logoutAll,
  refresh,
  resetPassword,
} from "./controllers/auth.controller.js";
import { authenticate } from "./middlewares/authenticate.middleware.js";

const authRouter: Router = Router();

// Registration
authRouter.post("/register", validate(registerSchema), register);
authRouter.post(
  "/register/resend-otp",
  validate(resendRegistrationOtpSchema),
  resendRegistrationOtp,
);
authRouter.post(
  "/register/verify-otp",
  validate(completeRegistrationSchema),
  completeRegistration,
);

// Login and token management
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);

// Protected authentication routes
authRouter.post("/logout-all", authenticate, logoutAll);
authRouter.get("/me", authenticate, getMe);

authRouter.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  forgotPassword,
);

authRouter.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPassword,
);

export default authRouter;
