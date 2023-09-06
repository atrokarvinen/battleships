import { APIRequestContext } from "@playwright/test";
import { v4 as uuid } from "uuid";
import { deleteRequest, post } from "./api-request";
import {
  AddPlayerToGamePayload,
  GameSeed,
  JoinGamePayload,
  LoginInfo,
} from "./models";

// Make sure the name is unique to prevent parallel tests from
// clashing with each other.
export const uniquefy = (name: string) => {
  return `${name}-${uuid()}`;
};

export const signUpAndSignIn = async (payload: LoginInfo) => {
  await signUp(payload);
  await signIn(payload);
};

export const signUp = ({ req, user }: LoginInfo) => {
  const { username, password } = user;

  return post({
    request: req,
    url: "/auth/sign-up",
    data: {
      username: username,
      password: password,
      confirmPassword: password,
    },
  });
};

export const signIn = ({ req, user }: LoginInfo) => {
  return post({ request: req, url: "/auth/sign-in", data: user });
};

export const deleteGameRoomByTitle = (
  request: APIRequestContext,
  title: string
) => {
  return deleteRequest({ request, url: `/test/games/${title}` });
};

export const deleteGamesFromGameRoom = (
  request: APIRequestContext,
  title: string
) => {
  return deleteRequest({ request, url: `/test/games/${title}/games` });
};

export const deleteUserByName = (request: APIRequestContext, name: string) => {
  return deleteRequest({ request, url: `/test/users/${name}` });
};

export const createGameRoom = (
  request: APIRequestContext,
  data: { title: string; opponentType?: number }
) => {
  data.opponentType ??= 1;
  return post({ request, url: "/game-room", data });
};

export const leaveGame = (
  request: APIRequestContext,
  data: JoinGamePayload
) => {
  return post({ request, url: "/game-room/player/leave", data });
};

export const joinGame = (request: APIRequestContext, data: JoinGamePayload) => {
  return post({ request, url: "/game-room/player/join", data });
};

export const addPlayerToGame = (
  request: APIRequestContext,
  data: AddPlayerToGamePayload
) => {
  return post({ request, url: "/test/games/player", data });
};

export const startGameRequest = (
  request: APIRequestContext,
  gameRoomId: string
) => {
  return post({ request, url: "/game/start", data: { gameRoomId } });
};

export const seedGameShips = (request: APIRequestContext, setup: GameSeed) => {
  return post({ request, url: "/test/games/seed", data: setup });
};
