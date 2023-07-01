import { ShipPart } from "./square-ship-part";
import { AttackResult } from "./square/attack-result";

export type Point = {
  x: number;
  y: number;
};

export type BoardPoint = {
  point: Point;
  shipPart: ShipPart;
  attackResult: AttackResult;
  defendResult: AttackResult;
};
