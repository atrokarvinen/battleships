import { APIRequestContext } from "@playwright/test";

export type User = {
  username: string;
  password: string;
};

export type GameSeed = {
  firstPlayerName: string;
  gameRoomId: string;
  shipPositions: ShipPlacement[];
};

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

export type LoginInfo = {
  req: APIRequestContext;
  user: User;
};
