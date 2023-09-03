import { axios } from "../api/axios";
import { BoardPoint, ShipPart } from "../board/models";
import { generateEmptyBoardPoints } from "../board/redux/board-utils";
import { ActiveGameState, pointMatches } from "../redux/activeGameSlice";
import { GameDTO, GameState, ShipDTO } from "./apiModel";

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

export const mapShipsToBoardPoint = (ships: ShipDTO[]) => {
  const shipPoints: BoardPoint[] = ships.map(shipToBoardPoint).flat();
  return shipPoints;
};

export const mergePoints = (shipPoints: BoardPoint[]) => {
  // Generate an empty canvas of points. Overwrite points
  // where there is a ship with ship information.
  const emptyPoints = generateEmptyBoardPoints();
  const mergedPoints = emptyPoints.map((defaultPoint) => {
    const shipPoint = shipPoints.find(pointMatches(defaultPoint.point));
    if (!shipPoint) return defaultPoint;
    return shipPoint;
  });
  return mergedPoints;
};

export const shipToBoardPoint = (ship: ShipDTO) => {
  const { start, isVertical, length } = ship;
  const boardPoints = Array.from(Array(length).keys()).map((n) => {
    const shipPart = lengthIndexToShipPart(n, length);
    const boardPoint: BoardPoint = {
      point: {
        x: isVertical ? start.x : start.x + n,
        y: !isVertical ? start.y : start.y + n,
      },
      shipPart: { isVertical, part: shipPart },
    };
    return boardPoint;
  });
  return boardPoints;
};

const lengthIndexToShipPart = (index: number, length: number) => {
  // Ships with length of 1 are sunk enemy ships for which it is
  // still unknown what shape the ship will have.
  if (length === 1) {
    return ShipPart.UNKNOWN;
  }

  return index === 0
    ? ShipPart.START
    : index === length - 1
    ? ShipPart.END
    : ShipPart.MIDDLE;
};
