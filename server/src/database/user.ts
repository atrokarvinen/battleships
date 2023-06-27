import { Schema, model, Types } from "mongoose";
import { toObjectOptions } from "./dbOptions";

export interface IUser {
  id?: string;

  username: string;
  password: string;

  games: Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    games: [{ ref: "game", type: Schema.Types.ObjectId }],
  },
  { toObject: toObjectOptions }
);

export const User = model<IUser>("user", userSchema);
