import { Router } from "express";

import { authenticate } from "../../auth/auth.middleware.js";

import {
  getMyDeveloperProfileController,
  saveMyDeveloperProfileController,
} from "./developer-profile.controller.js";
import { validate } from "../../../middleware/validate.middleware.js";
import { developerProfileUpdateSchema } from "./developer-profile.validation.js";

const router: Router = Router();

// All developer profile routes require authentication.
router.use(authenticate);

router.get("/me", getMyDeveloperProfileController);

router.patch(
  "/me",
  validate(developerProfileUpdateSchema),
  saveMyDeveloperProfileController,
);

export const developerProfileRoutes = router;
