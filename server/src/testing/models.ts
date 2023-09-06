import { GameState, Ship } from "../game/models";

export type GameSeed = {
  state: GameState;
  firstPlayerName: string;
  gameRoomId: string;
  shipPositions: ShipPlacement[];
};

export type ShipPlacement = {
  playerId: string;
  ships: Ship[];
};
