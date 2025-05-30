import { body, param } from "express-validator";

export const createApikey = [
  body("key")
    .notEmpty()
    .withMessage("key is required")
    .isString()
    .withMessage("key must be a string"),
  body("app").notEmpty().withMessage("app is required"),
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



export const getApikeyById = [
  param("id").isMongoId().withMessage("id must be a valid mongo id"),
];  
export const deleteApikey = [
  param("id").isMongoId().withMessage("id must be a valid mongo id"),
];