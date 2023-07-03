import { Point } from "../game/models/point";

export type GameSeed = {
  gameRoomId: string;
  shipPositions: ShipPlacement[];
};

export type ShipPlacement = {
  playerId: string;
  shipPoints: Point[];
};
