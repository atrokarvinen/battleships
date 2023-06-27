import axios from "axios";
import { config } from "../config/config";
import { CreateGame } from "./createGame";

const baseUrl = `${config.backendBaseUrl}/game-room`;

export const getGamesRequest = () => {
  return axios.get(baseUrl);
};

export const getGameRequest = (id: string) => {
  return axios.get(`${baseUrl}/${id}`);
};

export const createGameRequest = (payload: CreateGame) => {
  return axios.post(baseUrl, payload);
};

export const deleteGameRequest = (id: string) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export const deleteAllGamesRequest = () => {
  return axios.delete(baseUrl);
};

export const joinGameRequest = (gameId: string) => {
  return axios.post(
    `${baseUrl}/player/join`,
    { gameId },
    { withCredentials: true }
  );
};

export const leaveGameRequest = (gameId: string) => {
  return axios.post(
    `${baseUrl}/player/leave`,
    { gameId },
    { withCredentials: true }
  );
};

export const getAccountInfo = () => {
  return axios.get(`${config.backendBaseUrl}/account`, {
    withCredentials: true,
  });
};
