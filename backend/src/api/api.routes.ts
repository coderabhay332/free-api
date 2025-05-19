import { Router } from "express";
import passport from "passport";
import { catchError } from "../common/middleware/catch-error";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import * as apiController from "./api.controller";


const router = Router();

router
    .post("/create", roleAuth(["ADMIN"]), catchError, apiController.createApi)
    .get("/all", roleAuth(["ADMIN", "USER"]), catchError, apiController.getAllApis)
     .get("/demo/:id", roleAuth(["ADMIN", "USER"]), catchError,apiController.demoApi)
     .get("/analyze/:id", roleAuth(["ADMIN", "USER"]), catchError, apiController.analyzeApi)
    .get("/:id", roleAuth(["ADMIN", "USER"]), catchError, apiController.getApiById)
    .post("/purchesed/:id", roleAuth(["USER", "ADMIN"]),catchError, apiController.responseApi);
   



    export default router;
