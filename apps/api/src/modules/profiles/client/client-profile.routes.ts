import { Router } from "express";

import { authenticate } from "../../auth/auth.middleware.js";

import {
  getMyClientProfileController,
  createMyClientProfileController,
  updateMyClientProfileController,
} from "./client-profile.controller.js";
import { validate } from "../../../middleware/validate.middleware.js";
import { clientProfileCreateSchema } from "./client-profile.validation.js";

const router: Router = Router();

// All client profile routes require authentication.
router.use(authenticate);

router.get("/me", getMyClientProfileController);

router.post("/me", validate(clientProfileCreateSchema), createMyClientProfileController);

router.patch("/me", updateMyClientProfileController);

export const clientProfileRoutes = router;
