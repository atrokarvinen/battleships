import { Schema, model } from "mongoose";
import { toObjectOptions } from "../../database/dbOptions";

export type PlayerType = {
  id: string;
  name: string;
};

export interface IPlayer {
  name: string;
  games: string[];
}

export const playerSchema = new Schema<IPlayer>(
  {
    games: [Schema.Types.ObjectId],
    name: String,
  },
  { toObject: toObjectOptions }
);

export const Player = model<IPlayer>("player", playerSchema);
