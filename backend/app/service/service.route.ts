import { Router } from "express";
import { catchError } from "../common/middleware/catch-error";
import * as serviceController from "./service.controller";
import * as serviceValidator from "./service.validation";
import { validateApiKey } from "../common/middleware/api-key.middleware";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
  .get("/all", catchError, roleAuth(["ADMIN", "USER"]), serviceController.getAllService)
  .get("/:id", catchError, roleAuth(["ADMIN", "USER"]), serviceController.getServiceById)
  .get("/demo/weather", catchError, validateApiKey, serviceController.getWeather)
  .get("/demo/random-user", catchError, validateApiKey, serviceController.getRandomUser)
  .get("/demo/joke", catchError, validateApiKey, serviceController.getJoke)
  .get("/demo/quote", catchError, validateApiKey, serviceController.getQuote)
  .get("/demo/news", catchError, validateApiKey, serviceController.getNews)
  .get("/analytics/user", catchError, roleAuth(["USER", "ADMIN"]), serviceController.getUserServiceAnalytics)
  .get("/analytics/admin", catchError, roleAuth(["ADMIN"]), serviceController.getAdminServiceAnalytics)
  .post(
    "/",
    serviceValidator.createService,
    catchError,
    roleAuth(["ADMIN"]),
    serviceController.createService,  
  )
  .put("/:id", serviceValidator.updateService, catchError, roleAuth(["ADMIN"]), serviceController.updateService)
  .delete("/:id", catchError, roleAuth(["ADMIN"]), serviceController.deleteService)



export default router;
