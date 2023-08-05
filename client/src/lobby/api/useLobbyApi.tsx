import { useEffect } from "react";
import { useApiRequest } from "../../api/useApiRequest";
import {
  addNewGameRoom,
  joinGame as joinGameAction,
  leaveGame as leaveGameAction,
  setGameRooms,
} from "../../redux/gameRoomSlice";
import { useAppDispatch } from "../../redux/hooks";
import { addPlayerToGame, removePlayerFromGame } from "../../redux/playerSlice";
import { CreateGame } from "../createGameRoom/createGame";
import {
  createGameRequest,
  getGamesRequest,
  joinGameRequest,
  leaveGameRequest,
} from "./api";

export const useLobbyApi = () => {
  const { request } = useApiRequest();
  const dispatch = useAppDispatch();

  useEffect(() => {
    getGames();
  }, []);

  async function createGame(data: CreateGame) {
    console.log("creating game with data: ", data);

    const response = await request(createGameRequest(data), true);
    if (!response) throw new Error("Failed to create game");
    console.log("Game %s created", response.data);
    dispatch(addNewGameRoom(response.data));
  }

  async function getGames() {
    const response = await request(getGamesRequest());
    if (!response) return;
    const games = response.data;
    console.log("fetched games count: " + games.length);
    dispatch(setGameRooms(games));
  }

  async function joinGame(gameId: string) {
    const response = await request(joinGameRequest(gameId), true);
    if (!response) throw new Error("Failed to join game");
    dispatch(joinGameAction(response.data));
    dispatch(addPlayerToGame(response.data));
  }

  async function leaveGame(gameId: string) {
    const response = await request(leaveGameRequest(gameId), true);
    if (!response) throw new Error("Failed to leave game");
    dispatch(leaveGameAction(response.data));
    dispatch(removePlayerFromGame(response.data));
  }

  return { leaveGame, joinGame, getGames, createGame };
};
