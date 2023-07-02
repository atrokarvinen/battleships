import { APIRequestContext } from "@playwright/test";

export type User = {
  username: string;
  password: string;
};

export type GameSeed = {
  gameRoomId: string;
  shipPositions: ShipPlacement[];
};

export type ShipPlacement = {
  playerId: string;
  shipPoints: Point[];
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
