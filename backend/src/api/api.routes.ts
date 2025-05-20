import { Router } from "express";
import passport from "passport";
import { catchError } from "../common/middleware/catch-error";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import * as apiController from "./api.controller";

const router = Router();


router
.post("/create", roleAuth(["ADMIN"]), catchError, apiController.createApi)

.get("/all", roleAuth(["ADMIN", "USER"]), catchError, apiController.getAllApis)
.post("/demo/:id", roleAuth(["ADMIN", "USER"]), catchError, apiController.demoApi)

.get("/:id", roleAuth(["ADMIN", "USER"]), catchError, apiController.getApiById)


.post("/subscribe/:id", roleAuth(["USER", "ADMIN"]), catchError, apiController.subscribeApi);

    export default router;
