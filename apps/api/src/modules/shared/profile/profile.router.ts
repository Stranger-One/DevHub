import { Router } from "express";
import { getProfileByIdController } from "./profile.controller.js";

const router: Router = Router();

router.get("/:userId", getProfileByIdController);

const profileRouter = router;

export default profileRouter;
