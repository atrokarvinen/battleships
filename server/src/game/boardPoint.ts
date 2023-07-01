import { AttackResult } from "./attack-result";
import { Point } from "./point";
import { ShipPart } from "./square-ship-part";

export type BoardPoint = {
  point: Point;
  shipPart: ShipPart;
  attackResult: AttackResult;
  defendResult: AttackResult;
};
