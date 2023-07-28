import * as yup from "yup";

const maxNameLength = process.env.NODE_ENV === "development" ? 50 : 20;

export const schema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(maxNameLength, `Username must be at most ${maxNameLength} characters`),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be at most 50 characters")
    .matches(/.*[A-Z].*/, "Password must contain at least one uppercase letter")
    .matches(/.*[0-9].*/, "Password must contain at least one number"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});
