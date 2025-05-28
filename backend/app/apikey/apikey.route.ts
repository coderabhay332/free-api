import { Router } from "express";
import { catchError } from "../common/middleware/catch-error";
import * as apikeyController from "./apikey.controller";
import * as apikeyValidator from "./apikey.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
  .get("/", catchError, roleAuth(["ADMIN", "USER"]), apikeyController.getAllApikey)
  .get("/:id", catchError, roleAuth(["ADMIN", "USER"]), apikeyController.getApikeyById)
  .put("/:id", apikeyValidator.updateApikey, catchError, roleAuth(["ADMIN", "USER"]), apikeyController.updateApikey)
  .delete("/:id", catchError, roleAuth(["ADMIN", "USER"]), apikeyController.deleteApikey)
  .post(
    "/",
    apikeyValidator.createApikey,
    catchError,
    roleAuth(["ADMIN", "USER"]),
    apikeyController.createApikey,
  );

export default router;
