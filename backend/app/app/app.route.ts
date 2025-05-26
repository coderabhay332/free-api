import { Router } from "express";
import { catchError } from "../common/middleware/catch-error";
import * as appController from "./app.controller";
import * as appValidator from "./app.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
  .get("/", appController.getAllApp)
  .post("/create-app", catchError,roleAuth(["ADMIN", "USER"]), appController.createApp)
  .get("/:id", appController.getAppById);


export default router;
