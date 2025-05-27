import { Router } from "express";
import { catchError } from "../common/middleware/catch-error";
import * as serviceController from "./service.controller";
import * as serviceValidator from "./service.validation";
import { validateApiKey } from "../common/middleware/api-key.middleware";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
  .get("/all", serviceController.getAllService)
  .get("/:id", serviceController.getServiceById)
  
  // Demo API endpoints
  .get("/demo/weather", validateApiKey, serviceController.getWeather)
  .get("/demo/random-user", validateApiKey, serviceController.getRandomUser)
  .get("/demo/joke", validateApiKey, serviceController.getJoke)
  .get("/demo/quote", validateApiKey, serviceController.getQuote)
  .get("/demo/news", validateApiKey, serviceController.getNews)
  .get("/analytics/user", roleAuth(["USER", "ADMIN"]), serviceController.getUserServiceAnalytics)
  .get("/analytics/admin", roleAuth(["ADMIN"]), serviceController.getAdminServiceAnalytics)
  .post(
    "/",
    serviceValidator.createService,
    catchError,
    serviceController.createService,
  );


export default router;
