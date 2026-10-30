import { Router } from "express";
import {
  register,
  resendRegistrationOtp,
  completeRegistration,
} from "./controllers/registration.controller.js";
import {
  completeRegistrationSchema,
  registerSchema,
  resendRegistrationOtpSchema,
} from "./auth.validation.js";
import { validate } from "../../middleware/validate.middleware.js";

const authRouter: Router = Router();

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

export default authRouter;
