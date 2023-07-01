import { APIRequestContext, expect } from "@playwright/test";
import { config } from "./config";
import { GameSeed, User } from "./models";

const { backendUrl } = config;

export const uniquefy = (name: string) => {
  return `${name}-${Date.now()}`;
};

type LoginInfo = {
  req: APIRequestContext;
  user: User;
};

export const signUpAndSignIn = async (payload: LoginInfo) => {
  await signUp(payload);
  await signIn(payload);
};

export const signUp = async ({ req, user }: LoginInfo) => {
  const { username, password } = user;
  const signUpResponse = await req.post(`${backendUrl}/auth/sign-up`, {
    data: {
      username: username,
      password: password,
      confirmPassword: password,
    },
  });
  expect(signUpResponse.ok()).toBeTruthy();
};

export const signIn = async ({ req, user }: LoginInfo) => {
  const { username, password } = user;
  const signInResponse = await req.post(`${backendUrl}/auth/sign-in`, {
    data: { username, password },
  });
  expect(signInResponse.ok()).toBeTruthy();
};

export const deleteGameRoomByTitle = async (
  request: APIRequestContext,
  title: string
) => {
  await request.delete(`${backendUrl}/test/games/${title}`);
};

export const deleteGamesFromGameRoom = async (
  request: APIRequestContext,
  title: string
) => {
  await request.delete(`${backendUrl}/test/games/${title}/games`);
};

export const deleteUserByName = async (
  request: APIRequestContext,
  name: string
) => {
  await request.delete(`${backendUrl}/test/users/${name}`);
};

export const createGameRoom = async (
  request: APIRequestContext,
  { title }: { title: string }
) => {
  return await request.post(`${backendUrl}/game-room`, { data: { title } });
};

export type JoinGamePayload = {
  gameId: string;
};

export const joinGame = async (
  request: APIRequestContext,
  data: JoinGamePayload
) => {
  const cookies = (await request.storageState()).cookies;
  const jwt = cookies.find((c) => c.name === "jwt-cookie");
  const response = await request.post(`${backendUrl}/game-room/player/join`, {
    data,
    headers: { ["Cookie"]: `jwt-cookie=${jwt?.value}` },
  });
  expect(response.ok()).toBeTruthy();
};

export const startGame = async (
  request: APIRequestContext,
  { title }: { title: string }
) => {};

export const seedGameShips = async (
  request: APIRequestContext,
  setup: GameSeed
) => {
  request.post(`${backendUrl}/test/games/seed`, { data: setup });
};
