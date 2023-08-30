import { Ship } from "../game/models";

export type GameSeed = {
  firstPlayerName: string;
  gameRoomId: string;
  shipPositions: ShipPlacement[];
};

export type ShipPlacement = {
  playerId: string;
  ships: Ship[];
};
