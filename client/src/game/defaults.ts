import { PlayerDTO, ShipPart, Square } from "./apiModel";

export const defaultSquare: Square = {
  ship: ShipPart.UNKNOWN,
  hasBeenAttacked: false,
  hasShip: false,
  isVertical: false,
  point: { x: 0, y: 0 },
};

export const defaultPlayer: PlayerDTO = {
  attacks: [],
  isAi: false,
  ownShips: [],
  placementsReady: false,
  playerId: "1",
};
