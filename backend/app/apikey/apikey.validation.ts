import { body } from "express-validator";

export const createApikey = [
  body("key")
    .notEmpty()
    .withMessage("key is required")
    .isString()
    .withMessage("key must be a string"),
  body("app").notEmpty().withMessage("app is required"),
  body("isActive").isBoolean().withMessage("isActive must be a boolean"),
  body("createdAt"),
];

export const updateApikey = [
  body("key")
    .notEmpty()
    .withMessage("key is required")
    .isString()
    .withMessage("key must be a string"),
  body("app").notEmpty().withMessage("app is required"),
  body("isActive").isBoolean().withMessage("isActive must be a boolean"),
  body("createdAt"),
];

export const editApikey = [
  body("key").isString().withMessage("key must be a string"),
  body("app"),
  body("isActive").isBoolean().withMessage("isActive must be a boolean"),
  body("createdAt"),
];
