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

export const confirmPlacementsRequest = ({
  gameRoomId,
}: {
  gameRoomId: string;
}) => {
  return axios.post(`/game/${gameRoomId}/confirm-placements`);
};

export const getOpponentShipLocationsRequest = (
  gameId: string,
  opponentId: string
) => {
  return axios.get(`/test/game/${gameId}/opponent/${opponentId}/ships`);
};

export const mapGameDtoToActiveGame = (game: GameDTO) => {
  const activeGame: ActiveGameState = {
    showOpponentBoard: false,
    primaryBoard: {
      playerId: "not needed",
      points: mapSquaresToBoardPoint(game.primaryBoard),
    },
    trackingBoard: {
      playerId: "not needed",
      points: mapSquaresToBoardPoint(game.trackingBoard),
    },
    id: game.id,
    isGameStarted: game.state === GameState.STARTED,
    isGameOver: game.players
      .map((p) => p.playerId)
      .includes(game.winnerPlayerId),
    activePlayerId: game.activePlayerId,
    winnerPlayerId: game.winnerPlayerId,
    showGameOverDialog: false,
  };

  return activeGame;
};

export const mapSquaresToBoardPoint = (squares: Square[]) => {
  if (!squares) return [];
  const boardPoints: BoardPoint[] = squares.map((square) => {
    const boardPoint: BoardPoint = {
      point: square.point,
      attackResult: determineAttackResult(square),
      shipPart: determineShipPart(square),
    };
    return boardPoint;
  });
  return boardPoints;
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
  if (square.hasShip && square.hasBeenAttacked) {
    return ShipPart.EnemyExplosion;
  }
  return ShipPart.None;
};
