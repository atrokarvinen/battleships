import { CustomValidator, check } from "express-validator";

const passwordsMatch: CustomValidator = (confirmPassword, meta) => {
  const body = meta.req.body;
  const isSame = body.password === confirmPassword;
  if (!isSame) {
    throw new Error("Passwords do not match");
  }
  return true;
};

// prettier-ignore
export const signUpValidation = [
  check("username")
    .notEmpty().withMessage("Cannot be empty")
    .isLength({ min: 3 }).withMessage("Too short. Min 3 characters")
    .isLength({ max: 50 }).withMessage("Too long. Max 50 characters"),
  check("password")
    .notEmpty().withMessage("Cannot be empty")
    .isLength({ min: 8 }).withMessage("Too short. Min 8 characters")
    .isLength({ max: 50 }).withMessage("Too long. Max 50 characters")
    .matches(/.*[A-Z].*/).withMessage("Password must contain at least one uppercase letter")
    .matches(/.*[0-9].*/).withMessage("Password must contain at least one number"),
  check("confirmPassword")
    .notEmpty().withMessage("Cannot be empty")
    .custom(passwordsMatch).withMessage("Passwords must match"),
];

export const signInValidation = [
  check("username").notEmpty().withMessage("Cannot be empty"),
  check("password").notEmpty().withMessage("Cannot be empty"),
];
