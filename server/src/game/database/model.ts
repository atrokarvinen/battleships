import { Point } from "../models/point";

// TODO needs to be named separately from the existing Ship related to ship-reserve
export type Ship = {
  length: number;
  start: Point;
  isVertical: boolean;
};
