import * as yup from "yup";
import { OpponentType } from "./createGame";

const maxLength = process.env.NODE_ENV === "development" ? 75 : 20;

const validOpponents = Object.values(OpponentType)
  .filter((v) => v !== OpponentType.UNKNOWN && !isNaN(+v))
  .map((v) => +v);

export const schema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "At least 3 letters")
    .max(maxLength, `At most ${maxLength} letters`),
  opponentType: yup
    .number()
    .required("Select an option")
    .oneOf(validOpponents, "Not a valid selection"),
});
