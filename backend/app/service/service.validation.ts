import { body } from "express-validator";

export const createService = [
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("name must be a string"),
  body("pricePerCall")
    .notEmpty()
    .withMessage("pricePerCall is required")
    .isNumeric()
    .withMessage("pricePerCall must be a number"),
  body("endpoint")
    .notEmpty()
    .withMessage("endpoint is required")
    .isString()
    .withMessage("endpoint must be a string"),
  body("description").isString().withMessage("description must be a string"),
];

export const updateService = [
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("name must be a string"),
  body("pricePerCall")
    .notEmpty()
    .withMessage("pricePerCall is required")
    .isNumeric()
    .withMessage("pricePerCall must be a number"),
  body("endpoint")
    .notEmpty()
    .withMessage("endpoint is required")
    .isString()
    .withMessage("endpoint must be a string"),
  body("description").isString().withMessage("description must be a string"),
];

export const editService = [
  body("name").isString().withMessage("name must be a string"),
  body("pricePerCall").isNumeric().withMessage("pricePerCall must be a number"),
  body("endpoint").isString().withMessage("endpoint must be a string"),
  body("description").isString().withMessage("description must be a string"),
];
