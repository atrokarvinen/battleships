import { Schema, Types, model } from "mongoose";
import { toObjectOptions } from "./dbOptions";

export type UserDTO = {
  id: string;
  username: string;
  gamesJoined: string[];
};

export interface IUser {
  id?: string;

  username: string;
  password: string;

  gamesJoined: Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    gamesJoined: [{ ref: "game", type: Schema.Types.ObjectId }],
  },
  { toObject: toObjectOptions }
);

export const User = model<IUser>("user", userSchema);
