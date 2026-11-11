import { Router } from "express";
import developerProfileRouter from "./profile/developer-profile.routes.js";


const router: Router = Router()


router.use("/profile", developerProfileRouter)


const developerRouter = router
export default developerRouter