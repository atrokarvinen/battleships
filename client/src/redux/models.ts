import { Point } from "../board/point";

export type AttackShipPayload = {
  point: Point;
  attackerPlayerId: string;
};

export type AddShipPayload = {
  points: Point[];
  start: Point;
  end: Point;
  isVertical: boolean;
  playerId: string;
  boardId: string;
};

export type AttackResultPayload = {
  hasShip: boolean;
  isGameOver: boolean;
  point: Point;
  nextPlayerId: string;
  attackerPlayerId: string;
  winnerPlayerId?: string;
};
