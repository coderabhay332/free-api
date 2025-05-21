import { Router } from "express";
import passport from "passport";
import { catchError } from "../common/middleware/catch-error";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import * as apiController from "./api.controller";
import { limiter } from "../common/helper/rate-limiter";
const router = Router();


router
.post("/create", limiter, roleAuth(["ADMIN"]), catchError, apiController.createApi)

.get("/all", limiter, roleAuth(["ADMIN", "USER"]), catchError, apiController.getAllApis)
.post("/demo/:id", limiter, roleAuth(["ADMIN", "USER"]), catchError, apiController.demoApi)

.get("/:id", limiter, roleAuth(["ADMIN", "USER"]), catchError, apiController.getApiById)


.post("/subscribe/:id", limiter, roleAuth(["USER", "ADMIN"]), catchError, apiController.subscribeApi);

    export default router;
