import express from "express"
import userRoutes from "./user/user.routes"
import apiRoutes from "./api/api.routes"
const router = express.Router();

router.use("/users", userRoutes);
router.use("/apis", apiRoutes);


export default router;