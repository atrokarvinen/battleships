import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AttackResult, BoardPoint, Point } from "../board/models";
import { Board } from "./boardSlice";
import { AttackResultPayload } from "./models";

export type Attack = {
  playerId: string;
  points: BoardPoint[];
};

export type ActiveGameState = {
  id: string;
  gameRoomId: string;

  activePlayerId?: string;
  winnerPlayerId?: string;

  isGameStarted: boolean;
  isGameOver: boolean;
  showGameOverDialog: boolean;

  primaryBoard: Board;
  trackingBoard: Board;

  showOpponentBoard: boolean;
};

export const initialState: ActiveGameState = {
  id: "1",
  gameRoomId: "1",

  isGameStarted: false,
  isGameOver: false,
  showGameOverDialog: false,

  primaryBoard: undefined as any,
  trackingBoard: undefined as any,

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
      state.primaryBoard = action.payload.primaryBoard;
      state.trackingBoard = action.payload.trackingBoard;
      state.winnerPlayerId = action.payload.winnerPlayerId;
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
      const { points, playerId } = action.payload;
      const opponent = state.trackingBoard;
      opponent.points.forEach((point) => {
        const foundPoint = points.find(
          (p) => p.point.x === point.point.x && p.point.y === point.point.y
        );
        if (!foundPoint || !foundPoint.shipPart) return;
        point.shipPart = foundPoint.shipPart;
      });
    },
    resetOpponentShipLocations: (state, action: PayloadAction<string>) => {
      const opponent = state.trackingBoard;
      opponent.points
        .filter((p) => p.attackResult === AttackResult.None)
        .forEach((point) => {
          point.shipPart = undefined;
        });
    },
    attackSquare: (state, action: PayloadAction<AttackResultPayload>) => {
      const {
        hasShip,
        isGameOver,
        nextPlayerId,
        point,
        winnerPlayerId,
        isOwnGuess,
      } = action.payload;

      console.log("Sinking ship at ", point);
      const board = isOwnGuess ? state.trackingBoard : state.primaryBoard;
      const attackedSquare = board.points.find(pointMatches(point));
      if (!attackedSquare) return;

      attackedSquare.attackResult = hasShip
        ? AttackResult.Hit
        : AttackResult.Miss;

      state.activePlayerId = nextPlayerId;
      state.winnerPlayerId = winnerPlayerId;
      state.isGameOver = isGameOver;
      if (isGameOver) {
        state.showGameOverDialog = true;
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
