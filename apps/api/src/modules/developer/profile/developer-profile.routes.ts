import { Router } from "express";
import { authenticate } from "../../auth/auth.middleware.js";
import { validate } from "../../../middleware/validate.middleware.js";
import * as controller from "./developer-profile.controller.js";
import {
  aboutSchema,
  certificationSchema,
  createProfileSchema,
  educationSchema,
  experienceSchema,
  introductionSchema,
  updateCertificationSchema,
  updateEducationSchema,
  updateExperienceSchema,
  updateSkillsSchema,
  updateSocialLinksSchema,
} from "./developer-profile.validation.js";

const router: Router = Router();

router.get("/me", authenticate, controller.me);
router.get("/:userId", controller.publicProfile);

router.use(authenticate);

router.post("/", validate(createProfileSchema), controller.create);

// PATCH routes for updating profile sections
router.patch(
  "/introduction",
  validate(introductionSchema.partial()),
  controller.introduction,
);
router.patch("/about", validate(aboutSchema), controller.about);
router.patch("/skills", validate(updateSkillsSchema), controller.skills);
router.patch(
  "/social-links",
  validate(updateSocialLinksSchema),
  controller.socialLinks,
);

// Education 
router.post("/education", validate(educationSchema), controller.addEducation);
router.patch(
  "/education/:educationId",
  validate(updateEducationSchema),
  controller.updateEducation,
);
router.delete("/education/:educationId", controller.deleteEducation);


// Experience
router.post(
  "/experience",
  validate(experienceSchema),
  controller.addExperience,
);
router.patch(
  "/experience/:experienceId",
  validate(updateExperienceSchema),
  controller.updateExperience,
);
router.delete("/experience/:experienceId", controller.deleteExperience);

// Certifications
router.post(
  "/certifications",
  validate(certificationSchema),
  controller.addCertification,
);
router.patch(
  "/certifications/:certificationId",
  validate(updateCertificationSchema),
  controller.updateCertification,
);
router.delete(
  "/certifications/:certificationId",
  controller.deleteCertification,
);

const developerProfileRouter = router;
export default developerProfileRouter;
