import { BoatPart } from "./cell-boat-part";
import { AttackResult } from "./cell/attack-result";

export type Point = {
  x: number;
  y: number;
};

export type BoardPoint = {
  point: Point;
  boatPart: BoatPart;
  attackResult: AttackResult;
  defendResult: AttackResult;
};
