import { Schema, model } from "mongoose";

export interface IPoint {
  x: string;
  y: string;
}

export interface IBoat {
  points: IPoint[];
  start: IPoint;
  end: IPoint;
  isVertical: boolean;
}

export interface IBoard {
  gameId: string;
  playerId: string;
  boats: IBoat[];
}

const boardSchema = new Schema<IBoard>({
  boats: [String],
  gameId: String,
  playerId: String,
});

export const Board = model<IBoard>("board", boardSchema);
