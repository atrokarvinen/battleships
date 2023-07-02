import { Point } from "../board/point";

export type AttackShipPayload = {
  point: Point;
  attackerPlayerId: string;
};
