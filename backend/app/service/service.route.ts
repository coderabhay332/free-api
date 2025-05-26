import { Router } from "express";
import { catchError } from "../common/middleware/catch-error";
import * as serviceController from "./service.controller";
import * as serviceValidator from "./service.validation";
import { validateApiKey } from "../common/middleware/api-key.middleware";

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

  .post(
    "/",
    serviceValidator.createService,
    catchError,
    serviceController.createService,
  );


export default router;
