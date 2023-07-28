import { check } from "express-validator";
import { env } from "../core/env";

const maxLength = env.NODE_ENV === "development" ? 75 : 20;

export const createGameValidation = [
  check("title")
    .notEmpty()
    .withMessage("Cannot be empty")
    .isLength({ min: 3 })
    .withMessage("Too short. Min 3 characters")
    .isLength({ max: maxLength })
    .withMessage(`Too long. Max ${maxLength} characters`),
];
