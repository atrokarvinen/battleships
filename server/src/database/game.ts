import { Schema, model, Types } from "mongoose";

export enum GameState {
  UNKNOWN,
  STARTED,
  ENDED,
}

export interface IGame {
  gameRoomId: string;
  playerIds: string[];
  state: GameState;
  activePlayerId: string;
}

export const gameSchema = new Schema<IGame>({
  gameRoomId: String,
  playerIds: [Schema.Types.String],
  state: Number,
});

export const Game = model<IGame>("game", gameSchema);
