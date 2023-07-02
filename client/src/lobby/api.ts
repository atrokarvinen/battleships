import { axios } from "../api/axios";
import { CreateGame } from "./createGame";

export const getGamesRequest = () => {
  return axios.get("/game-room");
};

export const getGameRequest = (id: string) => {
  return axios.get(`/game-room/${id}`);
};

export const createGameRequest = (payload: CreateGame) => {
  return axios.post("/game-room", payload);
};

export const deleteGameRequest = (id: string) => {
  return axios.delete(`/game-room/${id}`);
};

export const deleteAllGamesRequest = () => {
  return axios.delete("/game-room");
};

export const joinGameRequest = (gameId: string) => {
  return axios.post("/game-room/player/join", { gameId });
};

export const leaveGameRequest = (gameId: string) => {
  return axios.post("/game-room/player/leave", { gameId });
};
