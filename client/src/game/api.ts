import axios from "axios";
import { BoatPart } from "../board/cell-boat-part";
import { AttackResult } from "../board/cell/attack-result";
import { BoardPoint } from "../board/point";
import { config } from "../config/config";
import { ActiveGameState } from "../redux/activeGameSlice";
import { BoatPart as ApiBoatPart, Cell, GameDTO } from "./apiModel";

const _axios = axios.create({ baseURL: `${config.backendBaseUrl}/game` });

export type StartGamePayload = {
  gameRoomId: string;
  playerIds: string[];
};

export type ResetGamePayload = {
  gameRoomId: string;
};

export const startGameRequest = (payload: StartGamePayload) => {
  return _axios.post("/start", payload);
};

export const resetGameRequest = (payload: ResetGamePayload) => {
  return _axios.post("/reset", payload);
};

export const getGameByRoomIdRequest = (gameRoomId: string) => {
  return _axios.get(`/game-room/${gameRoomId}`);
};

export const mapGameDtoToActiveGame = (game: GameDTO) => {
  const activeGame: ActiveGameState = {
    boards: game.playerInfos.map((board) => ({
      playerId: board.playerId,
      points: board.ownShips.map((cell) => {
        const boardPoint: BoardPoint = {
          point: cell.point,
          attackResult: determineAttackResult(cell),
          defendResult: determineAttackResult(cell),
          boatPart: determineBoatPart(cell),
        };
        return boardPoint;
      }),
    })),
    guesses: game.playerInfos.map((board) => ({
      playerId: board.playerId,
      points: board.guesses.map((cell) => {
        const boardPoint: BoardPoint = {
          point: cell.point,
          attackResult: determineAttackResult(cell),
          defendResult: determineAttackResult(cell),
          boatPart: determineBoatPart(cell),
        };
        return boardPoint;
      }),
    })),
    id: game.id,
    isGameOver:
      game.winnerId === game.playerIds[0] ||
      game.winnerId === game.playerIds[1],
    players: game.playerIds.map((pId, index) => ({
      id: pId,
      username: "player #" + index,
    })),
    activePlayerId: game.activePlayerId,
    showGameOverDialog: false,
  };

  return activeGame;
};

const determineAttackResult = (cell: Cell) => {
  if (cell.hasBeenGuessed) {
    if (cell.hasBoat) {
      return AttackResult.Hit;
    }
    return AttackResult.Miss;
  }
  return AttackResult.None;
};

const determineBoatPart = (cell: Cell): BoatPart => {
  if (cell.isVertical) {
    if (cell.boat === ApiBoatPart.START) {
      return BoatPart.StartVertical;
    } else if (cell.boat === ApiBoatPart.MIDDLE) {
      return BoatPart.MiddleVertical;
    } else if (cell.boat === ApiBoatPart.END) {
      return BoatPart.EndVertical;
    }
  } else {
    if (cell.boat === ApiBoatPart.START) {
      return BoatPart.StartHorizontal;
    } else if (cell.boat === ApiBoatPart.MIDDLE) {
      return BoatPart.MiddleHorizontal;
    } else if (cell.boat === ApiBoatPart.END) {
      return BoatPart.EndHorizontal;
    }
  }
  return BoatPart.None;
};
