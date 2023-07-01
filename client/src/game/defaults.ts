import { BoatPart, Cell } from "./apiModel";

export const defaultCell: Cell = {
  boat: BoatPart.UNKNOWN,
  hasBeenGuessed: false,
  hasBoat: false,
  isVertical: false,
  point: { x: 0, y: 0 },
};
