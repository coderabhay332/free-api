import { Router } from "express";
import passport from "passport";
import { catchError } from "../common/middleware/catch-error";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import * as userController from "./user.controller";
import * as userValidator from "./user.validation";
import { limiter } from "../common/helper/rate-limiter";


const router = Router();
router
            .post("/register", limiter, userValidator.createUser, catchError, userController.createUser)
            .post("/login", limiter, userValidator.login, catchError, passport.authenticate('login', { session: false }), userController.login)
            .post("/refresh", limiter, catchError, userController.refreshToken)
            .post("/logout", limiter, catchError, userController.logout)
            .post("/subscribe/:id", limiter, roleAuth(["USER", "ADMIN"]), catchError, userController.subscribeApi)
            .get("/me", limiter, roleAuth(["USER", "ADMIN"]), catchError, userController.getMe)
            .get("/:id", limiter, roleAuth(["ADMIN"]), catchError, userController.getUserById);

            export default router;