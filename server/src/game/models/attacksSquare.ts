import { Point } from "./point";

export type AttackSquare = {
  point: Point;
  attackerPlayerId: string;
  gameId: string;
};
