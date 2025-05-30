import { Router } from "express";
import { catchError } from "../common/middleware/catch-error";
import * as appController from "./app.controller";
import * as appValidator from "./app.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
  .get("/", catchError, roleAuth(["ADMIN"]), appController.getAllApp)
  .post("/create-app",appValidator.createApp, catchError,roleAuth(["ADMIN", "USER"]), appController.createApp)
  .get("/:id",appValidator.getAppById,catchError, roleAuth(["ADMIN", "USER"]), appController.getAppById)
  .put("/:id", appValidator.updateApp, catchError, roleAuth(["ADMIN", "USER"]), appController.updateApp)
  .delete("/:id", catchError, roleAuth(["ADMIN", "USER"]), appController.deleteApp);


export default router;
