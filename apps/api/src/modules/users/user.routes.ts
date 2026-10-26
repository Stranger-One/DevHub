import { Router } from "express";
import { validateRegistration } from "./user.validation.middleware.js";
import { registerController } from "./user.controller.js";

const userRouter: Router = Router();

userRouter.post("/register", validateRegistration, registerController);

export default userRouter;
