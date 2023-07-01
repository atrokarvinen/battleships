import { Point } from "../point";

export type AttackShipPayload = {
  point: Point;
  attackerPlayerId: string;
};
