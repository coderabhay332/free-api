import { Router } from "express";
import { catchError } from "../common/middleware/catch-error";
import * as serviceController from "./service.controller";
import * as serviceValidator from "./service.validation";
import { validateApiKey } from "../common/middleware/api-key.middleware";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
  .get("/all", catchError, roleAuth(["ADMIN", "USER"]), serviceController.getAllService)
  .get("/:id", serviceValidator.getServiceById, catchError, roleAuth(["ADMIN", "USER"]), serviceController.getServiceById)
  .get("/demo/weather", validateApiKey, serviceController.getWeather)
  .get("/demo/random-user", validateApiKey, serviceController.getRandomUser)
  .get("/demo/joke", validateApiKey, serviceController.getJoke)
  .get("/demo/quote", validateApiKey, serviceController.getQuote)
  .get("/demo/news", validateApiKey, serviceController.getNews)
  .get("/user/analytics", roleAuth(["USER", "ADMIN"]), serviceController.getUserServiceAnalytics)
  .get("/admin/analytics", roleAuth(["ADMIN"]), serviceController.getAdminServiceAnalytics)
  .post(
    "/",
    serviceValidator.createService,
    catchError,
    roleAuth(["ADMIN"]),
    serviceController.createService,  
  )
  .put("/:id", serviceValidator.updateService, catchError, roleAuth(["ADMIN"]), serviceController.updateService)
  .delete("/:id",serviceValidator.deleteService, catchError, roleAuth(["ADMIN"]), serviceController.deleteService)



export default router;
