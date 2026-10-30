import { Router } from "express";
import {
  register,
  resendRegistrationOtp,
  completeRegistration,
} from "./controllers/registration.controller.js";

const authRouter: Router = Router();

authRouter.post("/register", register);
authRouter.post("/register/resend-otp", resendRegistrationOtp);
authRouter.post("/register/verify-otp", completeRegistration);

export default authRouter;
