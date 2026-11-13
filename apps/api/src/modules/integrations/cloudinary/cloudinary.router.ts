import { Router } from "express";
import { authenticate } from "../../auth/auth.middleware.js";
import { generateUploadSignature } from "./cloudinary.controller.js";


const router: Router = Router();



router.get("/signature", authenticate, generateUploadSignature);

const cloudinaryRouter: Router = router;

export default cloudinaryRouter;
