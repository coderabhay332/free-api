import { Router } from "express";
import { catchError } from "../common/middleware/catch-error";
import * as apikeyController from "./apikey.controller";
import * as apikeyValidator from "./apikey.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
  .get("/", catchError, roleAuth(["ADMIN"]), apikeyController.getAllApikey)
  .get("/:id", apikeyValidator.getApikeyById, catchError, roleAuth(["ADMIN"]), apikeyController.getApikeyById)
  .put("/:id", apikeyValidator.updateApikey, catchError, roleAuth(["ADMIN"]), apikeyController.updateApikey)
  .delete("/:id", apikeyValidator.deleteApikey, catchError, roleAuth(["ADMIN"]), apikeyController.deleteApikey)
  .post(
    "/",
    apikeyValidator.createApikey,
    catchError,
    roleAuth(["ADMIN", "USER"]),
    apikeyController.createApikey,
  );

export default router;
