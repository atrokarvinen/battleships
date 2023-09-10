import { axios } from "../../api/axios";
import { ActiveGameState } from "../../redux/activeGameSlice";
import { GameDTO, GameState } from "./apiModel";

export type StartGamePayload = { gameRoomId: string };
export type EndGamePayload = { gameRoomId: string };

export const startGameRequest = (payload: StartGamePayload) => {
  return axios.post("/game/start", payload);
};

export const endGameRequest = (payload: EndGamePayload) => {
  return axios.post("/game/end", payload);
};

export const getGameByRoomIdRequest = (gameRoomId: string) => {
  return axios.get(`/game-room/${gameRoomId}/game`);
};

export const getAiAttack = ({ gameRoomId }: { gameRoomId: string }) => {
  return axios.get(`/game/${gameRoomId}/attack/ai`);
};

export const mapGameDtoToActiveGame = (game: GameDTO) => {
  const activeGame: ActiveGameState = {
    id: game.id,
    gameRoomId: game.gameRoom,
    showOpponentBoard: false,
    players: game.players,
    state: game.state,
    isGameStarted: game.state === GameState.STARTED,
    isGameOver: game.state === GameState.ENDED,
    activePlayerId: game.activePlayerId,
    winnerPlayerId: game.winnerPlayerId,
    showGameOverDialog: false,
  };

  return activeGame;
};
