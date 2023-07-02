import { APIRequestContext } from "@playwright/test";
import { deleteRequest, post } from "./api-request";
import { GameSeed, JoinGamePayload, LoginInfo } from "./models";

// Make sure the name is unique to prevent parallel tests from
// clashing with each other.
export const uniquefy = (name: string) => {
  return `${name}-${Date.now()}`;
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
  data: { title: string }
) => {
  return post({ request, url: "/game-room", data });
};

export const joinGame = (request: APIRequestContext, data: JoinGamePayload) => {
  return post({ request, url: "/game-room/player/join", data });
};

export const seedGameShips = (request: APIRequestContext, setup: GameSeed) => {
  return post({ request, url: "/test/games/seed", data: setup });
};
