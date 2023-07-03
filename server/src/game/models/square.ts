import { Point } from "./point";
import { ShipPart } from "./shipPart";

export type Square = {
  point: Point;

  hasBeenAttacked: boolean;
  hasShip: boolean;
  ship: ShipPart;

  isVertical: boolean;
};
