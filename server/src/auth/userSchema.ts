import { Schema, model } from "mongoose";
import { toObjectOptions } from "../core/dbOptions";
import { IUser } from "./models/user";

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    gamesJoined: [{ ref: "game", type: Schema.Types.ObjectId }],
  },
  { toObject: toObjectOptions }
);

export const User = model<IUser>("user", userSchema);
