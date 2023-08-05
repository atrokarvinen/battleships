import { axios } from "../api/axios";
import { AttackResult, BoardPoint, Ship } from "../board/models";
import { ActiveGameState } from "../redux/activeGameSlice";
import { GameDTO, GameState, Square } from "./apiModel";

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
    id: game.id,
    gameRoomId: game.gameRoom,
    showOpponentBoard: false,
    primaryBoard: {
      playerId: "not needed",
      points: mapSquaresToBoardPoint(game.primaryBoard),
    },
    trackingBoard: {
      playerId: "not needed",
      points: mapSquaresToBoardPoint(game.trackingBoard),
    },
    isGameStarted: game.state === GameState.STARTED,
    isGameOver: game.state === GameState.ENDED,
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
      shipPart: mapShip(square),
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

const mapShip = (square: Square): Ship | undefined => {
  if (square.hasShip) {
    return { isVertical: square.isVertical, part: square.ship };
  }
  return undefined;
};
