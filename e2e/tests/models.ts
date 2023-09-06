import { APIRequestContext } from "@playwright/test";

export type User = {
  username: string;
  password: string;
};

export type GameSeed = {
  state: GameState;
  firstPlayerName: string;
  gameRoomId: string;
  shipPositions: ShipPlacement[];
};

export enum GameState {
  UNKNOWN,
  STARTED,
  ENDED,
  PLACEMENTS,
}

export type ShipPlacement = {
  playerId: string;
  ships: Ship[];
};

export type Ship = {
  start: Point;
  length: number;
  isVertical: boolean;
};

export type Point = {
  x: number;
  y: number;
};

export type JoinGamePayload = { gameId: string };

export type AddPlayerToGamePayload = { gameRoomId: string; playerName: string };

export type LoginInfo = {
  req: APIRequestContext;
  user: User;
};
