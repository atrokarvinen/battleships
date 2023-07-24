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

export type EndGamePayload = {
  gameRoomId: string;
};

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
    boards: game.players.map((board) => ({
      playerId: board.playerId,
      points: mapSquaresToBoardPoint(board.ownShips),
    })),
    attacks: game.players.map((board) => ({
      playerId: board.playerId,
      points: mapSquaresToBoardPoint(board.attacks),
    })),
    id: game.id,
    isGameStarted: game.state === GameState.STARTED,
    isGameOver: game.players
      .map((p) => p.playerId)
      .includes(game.winnerPlayerId),
    activePlayerId: game.activePlayerId,
    showGameOverDialog: false,
  };

  return activeGame;
};

export const mapSquaresToBoardPoint = (squares: Square[]) => {
  const boardPoints: BoardPoint[] = squares.map((square) => {
    const boardPoint: BoardPoint = {
      point: square.point,
      attackResult: determineAttackResult(square),
      defendResult: determineAttackResult(square),
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
  return ShipPart.None;
};
