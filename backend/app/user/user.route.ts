import { Router } from "express";
import { catchError } from "../common/middleware/catch-error";
import * as userController from "./user.controller";
import * as userValidator from "./user.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import passport from "passport";

const router = Router();

router
  .get("/", userController.getAllUser)
  .get("/me", roleAuth(["ADMIN", "USER"]), catchError, userController.me)
  .post("/login", userValidator.login, catchError, passport.authenticate('login', { session: false }), userController.login)
  .post("/register", userValidator.createUser, catchError, userController.createUser)
  .post("/refresh", catchError, roleAuth(["ADMIN", "USER"]), userController.refreshToken)
  .get("/:id", catchError, roleAuth(["ADMIN", "USER"]), userController.getUserById)
  .post("/add-funds", catchError, roleAuth(["ADMIN", "USER"]), userController.addFunds)
  .get("/getApp", roleAuth(["ADMIN", "USER"]), userController.getAppByUserId)
  .post("/subscribe/:id", catchError, roleAuth(["ADMIN", "USER"]), userController.subscribeApi)
  .post("/block/:id", catchError, roleAuth(["ADMIN", "USER"]), userController.blockApi)
  .post("/unblock/:id", catchError, roleAuth(["ADMIN", "USER"]), userController.unblockApi)

export default router;
