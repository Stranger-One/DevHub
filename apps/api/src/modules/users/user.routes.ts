import { Router } from "express";
import { loginController, registerController } from "./user.controller.js";

const userRouter: Router = Router();

userRouter.post("/register", registerController);
userRouter.post("/login", loginController);

export default userRouter;
