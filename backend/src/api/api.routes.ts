import { Router } from "express";
import passport from "passport";
import { catchError } from "../common/middleware/catch-error";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import * as apiController from "./api.controller";

const router = Router();


router.post("/create", roleAuth(["ADMIN"]), catchError, apiController.createApi);

router.get("/all", roleAuth(["ADMIN", "USER"]), catchError, apiController.getAllApis);


router.get("/:id", roleAuth(["ADMIN", "USER"]), catchError, apiController.getApiById);


router.post("/subscribe/:id", roleAuth(["USER", "ADMIN"]), catchError, apiController.subscribeApi);

    export default router;
