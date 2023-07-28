import * as yup from "yup";

const maxLength = process.env.NODE_ENV === "development" ? 75 : 20;

export const schema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "At least 3 letters")
    .max(maxLength, `At most ${maxLength} letters`),
});
