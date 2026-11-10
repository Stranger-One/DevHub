import { Router } from "express";

import { developerProfileRoutes } from "./developer/developer-profile.routes.js";
import { clientProfileRoutes } from "./client/client-profile.routes.js";

const router: Router = Router();

router.use("/developer", developerProfileRoutes);
router.use("/client", clientProfileRoutes);

export const profileRoutes = router;
