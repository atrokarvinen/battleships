import { Point } from "./point";

export type Ship = {
  length: number;
  start: Point;
  isVertical: boolean;
};

export type ShipDTO = {
  id: string;
  length: number;
  start: Point;
  isVertical: boolean;
};
