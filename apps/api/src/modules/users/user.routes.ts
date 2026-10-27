import { Router } from "express";
import {
  loginController,
  logout,
  me,
  refresh,
  registerController,
} from "./user.controller.js";

const userRouter: Router = Router();

userRouter.post("/register", registerController);
userRouter.post("/login", loginController);
userRouter.post("/refresh", refresh);
userRouter.post("/logout", logout);
userRouter.get("/me", me);

export default userRouter;
