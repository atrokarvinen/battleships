import { Point } from "../point";

export type AddBoatPayload = {
  points: Point[];
  start: Point;
  end: Point;
  isVertical: boolean;
  playerId: string;
  boardId: string;
};
