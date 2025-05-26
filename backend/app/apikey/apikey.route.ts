import { Router } from "express";
import { catchError } from "../common/middleware/catch-error";
import * as apikeyController from "./apikey.controller";
import * as apikeyValidator from "./apikey.validation";

const router = Router();

router
  .get("/", apikeyController.getAllApikey)
  
  .post(
    "/",
    apikeyValidator.createApikey,
    catchError,
    apikeyController.createApikey,
  );

export default router;
