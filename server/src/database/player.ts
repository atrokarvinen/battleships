import { model, Schema, Types } from "mongoose";
import { toObjectOptions } from "./dbOptions";

export interface IPlayer {
  name: string;
  games: Types.ObjectId[];
}

export const schema = new Schema<IPlayer>(
  {
    name: String,
    games: [{ ref: "game", type: Schema.Types.ObjectId }],
  },
  { toObject: toObjectOptions }
);

export const Player = model<IPlayer>("player", schema);
