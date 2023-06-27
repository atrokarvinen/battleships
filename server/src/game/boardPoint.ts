import { AttackResult } from "./attack-result";
import { BoatPart } from "./cell-boat-part";
import { Point } from "./point";

export type BoardPoint = {
  point: Point;
  boatPart: BoatPart;
  attackResult: AttackResult;
  defendResult: AttackResult;
};
