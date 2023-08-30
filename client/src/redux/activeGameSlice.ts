import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BoardPoint, Point } from "../board/models";
import { PlayerDTO } from "../game/apiModel";
import { AttackResultPayload } from "./models";

export type Attack = {
  playerId: string;
  points: BoardPoint[];
};

export type LastAttack = {
  playerId: string;
  point: Point;
};

export type ActiveGameState = {
  id: string;
  gameRoomId: string;

  activePlayerId?: string;
  winnerPlayerId?: string;

  isGameStarted: boolean;
  isGameOver: boolean;
  showGameOverDialog: boolean;

  players: PlayerDTO[];

  lastAttack?: LastAttack;
  showOpponentBoard: boolean;
};

export const initialState: ActiveGameState = {
  id: "1",
  gameRoomId: "1",

  isGameStarted: false,
  isGameOver: false,
  showGameOverDialog: false,

  players: [],

  showOpponentBoard: false,
};

const activeGameSlice = createSlice({
  initialState,
  name: "activeGame",
  reducers: {
    setActiveGame(state, action: PayloadAction<ActiveGameState>) {
      state.id = action.payload.id;
      state.gameRoomId = action.payload.gameRoomId;
      state.activePlayerId = action.payload.activePlayerId;
      state.isGameStarted = action.payload.isGameStarted;
      state.isGameOver = action.payload.isGameOver;
      state.players = action.payload.players;
      state.winnerPlayerId = action.payload.winnerPlayerId;
      state.lastAttack = undefined;
    },
    setIsGameOver(state, action: PayloadAction<boolean>) {
      const isOver = action.payload;
      console.log(`Setting game over to (${isOver})...`);
      state.isGameOver = isOver;
    },
    closeGameOverDialog(state) {
      console.log("closing game over dialog...");
      state.showGameOverDialog = false;
    },
    setShowOpponentBoard: (state, action: PayloadAction<boolean>) => {
      state.showOpponentBoard = action.payload;
    },
    setOpponentShipLocations: (
      state,
      action: PayloadAction<{
        points: BoardPoint[];
        playerId: string;
      }>
    ) => {
      // TODO can be refactored with players.ownShips maybe
      // const { points, playerId } = action.payload;
      // const opponent = state.trackingBoard;
      // opponent.points.forEach((point) => {
      //   const foundPoint = points.find(
      //     (p) => p.point.x === point.point.x && p.point.y === point.point.y
      //   );
      //   if (!foundPoint || !foundPoint.shipPart) return;
      //   point.shipPart = foundPoint.shipPart;
      // });
    },
    resetOpponentShipLocations: (state, action: PayloadAction<string>) => {
      // TODO can be refactored, see above
      // const opponent = state.trackingBoard;
      // opponent.points
      //   .filter((p) => p.attackResult === AttackResult.None)
      //   .forEach((point) => {
      //     point.shipPart = undefined;
      //   });
    },
    attackSquare: (state, action: PayloadAction<AttackResultPayload>) => {
      const {
        hasShip,
        isGameOver,
        nextPlayerId,
        point,
        winnerPlayerId,
        isOwnGuess,
        attackerPlayerId: attackerId,
      } = action.payload;

      console.log("Sinking ship at ", point);
      const attacker = state.players.find((p) => p.playerId === attackerId);
      const defender = state.players.find((p) => p.playerId !== attackerId);
      if (!attacker || !defender) return;

      attacker.attacks.push(point);
      if (hasShip) {
        defender.ownShips.push({ start: point, length: 1, isVertical: false });
      }

      state.activePlayerId = nextPlayerId;
      state.winnerPlayerId = winnerPlayerId;
      state.isGameOver = isGameOver;
      state.lastAttack = { playerId: attackerId, point };
      if (isGameOver) {
        state.showGameOverDialog = true;
        state.isGameStarted = false;
      }
    },
    gameOver: (state, action: PayloadAction<string>) => {
      state.winnerPlayerId = action.payload;
      state.isGameOver = true;
      state.showGameOverDialog = true;
    },
  },
});

export const pointMatches = (point: Point) => (boardPoint: BoardPoint) => {
  return boardPoint.point.x === point.x && boardPoint.point.y === point.y;
};
export const pointMatchesToPoint = (pointA: Point) => (pointB: Point) => {
  return pointB.x === pointA.x && pointB.y === pointA.y;
};

export const {
  setActiveGame,
  setIsGameOver,
  closeGameOverDialog,
  setShowOpponentBoard,
  setOpponentShipLocations,
  resetOpponentShipLocations,
  attackSquare,
  gameOver,
} = activeGameSlice.actions;

export const activeGameReducer = activeGameSlice.reducer;
