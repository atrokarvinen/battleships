import { AttackResult } from "./attack-result";
import { Point } from "./point";
import { Ship } from "./ship";

export type BoardPoint = {
  point: Point;
  shipPart?: Ship;
  attackResult: AttackResult;
};
