import express from "express"
import userRoutes from "./user/user.route"
import apiRoutes from "./apikey/apikey.route"
import serviceRoutes from "./service/service.route"
import appRoutes from "./app/app.route"

const router = express.Router();

router.use("/users", userRoutes);
router.use("/apis", apiRoutes);
router.use("/services", serviceRoutes);
router.use("/apps", appRoutes);
export default router;