import { Router } from "express";
import passport from "passport";
import { catchError } from "../common/middleware/catch-error";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import * as apiController from "./api.controller";
import { limiter } from "../common/helper/rate-limiter";
const router = Router();

router
.post("/create", limiter, roleAuth(["ADMIN"]), catchError, apiController.createApi)

// Demo routes with API key auth
.get("/demo/users", limiter, catchError, apiController.getDemoUsers)
.get("/demo/products", limiter, catchError, apiController.getDemoProducts)
.get("/demo/weather", limiter, catchError, apiController.getDemoWeather)
.get("/demo/news", limiter, catchError, apiController.getDemoNews)

// Protected routes
.get("/all", limiter, roleAuth(["ADMIN", "USER"]), catchError, apiController.getAllApis)
.get("/:id", limiter, roleAuth(["ADMIN", "USER"]), catchError, apiController.getApiById)
.post("/subscribe/:id", limiter, roleAuth(["USER", "ADMIN"]), catchError, apiController.subscribeApi);

export default router;
