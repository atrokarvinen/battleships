import { APIRequestContext, expect } from "@playwright/test";
import { config } from "./config";
import { User } from "./models";
import { defaultUser } from "./defaults";

const { backendUrl } = config;

type LoginInfo = {
  req: APIRequestContext;
  user?: User;
};

export const signUpAndSignIn = async (payload: LoginInfo) => {
  await signUp(payload);
  await signIn(payload);
};

export const signUp = async ({ req, user = defaultUser }: LoginInfo) => {
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

export const signIn = async ({ req, user = defaultUser }: LoginInfo) => {
  const { username, password } = user;
  const signInResponse = await req.post(`${backendUrl}/auth/sign-in`, {
    data: { username, password },
  });
  expect(signInResponse.ok()).toBeTruthy();
};

export const deleteAllUsers = async (request: APIRequestContext) => {
  await request.delete(`${backendUrl}/test/users`);
};

export const deleteAllGames = async (request: APIRequestContext) => {
  await request.delete(`${backendUrl}/game-room`);
};

export const deleteGameByTitle = async (
  request: APIRequestContext,
  title: string
) => {
  await request.delete(`${backendUrl}/test/games/${title}`);
};

export const deleteUserByName = async (
  request: APIRequestContext,
  name: string
) => {
  await request.delete(`${backendUrl}/test/users/${name}`);
};

export const createGame = async (
  request: APIRequestContext,
  { title }: { title: string }
) => {
  await request.post(`${backendUrl}/game-room`, { data: { title } });
};
