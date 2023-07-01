import { Schema, model } from "mongoose";

export interface IPoint {
  x: string;
  y: string;
}

export interface IShip {
  points: IPoint[];
  start: IPoint;
  end: IPoint;
  isVertical: boolean;
}

export interface IBoard {
  gameId: string;
  playerId: string;
  ships: IShip[];
}

const boardSchema = new Schema<IBoard>({
  ships: [String],
  gameId: String,
  playerId: String,
});

export const Board = model<IBoard>("board", boardSchema);
