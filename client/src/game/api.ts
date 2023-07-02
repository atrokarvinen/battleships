import { axios } from "../api/axios";
import { BoardPoint } from "../board/point";
import { ShipPart } from "../board/square-ship-part";
import { AttackResult } from "../board/square/attack-result";
import { ActiveGameState } from "../redux/activeGameSlice";
import {
  ShipPart as ApiShipPart,
  GameDTO,
  GameState,
  Square,
} from "./apiModel";

export type StartGamePayload = {
  gameRoomId: string;
  playerIds: string[];
};

export type ResetGamePayload = {
  gameRoomId: string;
};

export const startGameRequest = (payload: StartGamePayload) => {
  return axios.post("/game/start", payload);
};

export const resetGameRequest = (payload: ResetGamePayload) => {
  return axios.post("/game/reset", payload);
};

export const getGameByRoomIdRequest = (gameRoomId: string) => {
  return axios.get(`/game/game-room/${gameRoomId}`);
};

export const mapGameDtoToActiveGame = (game: GameDTO) => {
  const activeGame: ActiveGameState = {
    boards: game.playerInfos.map((board) => ({
      playerId: board.playerId,
      points: board.ownShips.map((square) => {
        const boardPoint: BoardPoint = {
          point: square.point,
          attackResult: determineAttackResult(square),
          defendResult: determineAttackResult(square),
          shipPart: determineShipPart(square),
        };
        return boardPoint;
      }),
    })),
    attacks: game.playerInfos.map((board) => ({
      playerId: board.playerId,
      points: board.attacks.map((square) => {
        const boardPoint: BoardPoint = {
          point: square.point,
          attackResult: determineAttackResult(square),
          defendResult: determineAttackResult(square),
          shipPart: determineShipPart(square),
        };
        return boardPoint;
      }),
    })),
    id: game.id,
    isGameStarted: game.state === GameState.STARTED,
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

const determineAttackResult = (square: Square) => {
  if (square.hasBeenAttacked) {
    if (square.hasShip) {
      return AttackResult.Hit;
    }
    return AttackResult.Miss;
  }
  return AttackResult.None;
};

const determineShipPart = (square: Square): ShipPart => {
  if (square.isVertical) {
    if (square.ship === ApiShipPart.START) {
      return ShipPart.StartVertical;
    } else if (square.ship === ApiShipPart.MIDDLE) {
      return ShipPart.MiddleVertical;
    } else if (square.ship === ApiShipPart.END) {
      return ShipPart.EndVertical;
    }
  } else {
    if (square.ship === ApiShipPart.START) {
      return ShipPart.StartHorizontal;
    } else if (square.ship === ApiShipPart.MIDDLE) {
      return ShipPart.MiddleHorizontal;
    } else if (square.ship === ApiShipPart.END) {
      return ShipPart.EndHorizontal;
    }
  }
  return ShipPart.None;
};
