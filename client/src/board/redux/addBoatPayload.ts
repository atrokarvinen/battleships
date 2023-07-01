import { Point } from "../point";

export type AddShipPayload = {
  points: Point[];
  start: Point;
  end: Point;
  isVertical: boolean;
  playerId: string;
  boardId: string;
};
