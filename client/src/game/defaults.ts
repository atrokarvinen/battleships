import { ShipPart, Square } from "./apiModel";

export const defaultSquare: Square = {
  ship: ShipPart.UNKNOWN,
  hasBeenAttacked: false,
  hasShip: false,
  isVertical: false,
  point: { x: 0, y: 0 },
};
