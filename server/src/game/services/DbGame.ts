import { Schema, model, HydratedDocument, InferSchemaType } from "mongoose";
import { toObjectOptions } from "../../database/dbOptions";
import { IPlayer, PlayerType, playerSchema } from "./DbPlayer";

export type GameType = {
  id: string;
  title: string;
  players: PlayerType[];
};

export interface IGame {
  title: string;
  //   players: string[];
  players: IPlayer[];
}

const gameSchema = new Schema<IGame>(
  {
    players: [playerSchema],
    // players: [{ type: Schema.Types.ObjectId, ref: "player" }],
    // players: [String],
    title: String,
  },
  { toObject: toObjectOptions }
);

export type GameSchemaType = InferSchemaType<typeof gameSchema>;

export const Game = model<IGame>("game", gameSchema);
