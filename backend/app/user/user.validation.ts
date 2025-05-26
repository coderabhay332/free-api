import { body, checkExact } from "express-validator";
import * as userService from "./user.service";

export const createUser = checkExact([
  body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
  body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Email must be valid')
      .custom(async (value: string) => {
          const user = await userService.getUserByEmail(value)
          if (user) throw new Error("Email is already exist.")
          return true
      }),
  body('password').notEmpty().withMessage('Password is required').isString().withMessage('Password must be a string'),
  body('confirmPassword').custom((value: any, { req }: any) => {
      if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
      }
      return true;
  })
]);


export const updateUser = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isString()
    .withMessage("email must be a string"),
  body("passwordHash")
    .notEmpty()
    .withMessage("passwordHash is required")
    .isString()
    .withMessage("passwordHash must be a string"),
  body("createdAt"),
];

export const editUser = [
  body("email").isString().withMessage("email must be a string"),
  body("passwordHash").isString().withMessage("passwordHash must be a string"),
  body("createdAt"),
];

export const login = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isString()
    .withMessage("email must be a string"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isString()
    .withMessage("password must be a string"),
];
