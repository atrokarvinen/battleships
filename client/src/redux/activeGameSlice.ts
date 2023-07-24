import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BoardPoint, Point } from "../board/point";
import { ShipPart } from "../board/square-ship-part";
import { AttackResult } from "../board/square/attack-result";
import { Board } from "./boardSlice";
import { AttackResultPayload } from "./models";

export type Attack = {
  playerId: string;
  points: BoardPoint[];
};

export type ActiveGameState = {
  id: string;

  activePlayerId?: string;
  winnerPlayerId?: string;

  isGameStarted: boolean;
  isGameOver: boolean;
  showGameOverDialog: boolean;

  boards: Board[];
  attacks: Attack[];

  showOpponentBoard: boolean;
};

export const initialState: ActiveGameState = {
  id: "1",
  isGameStarted: false,
  isGameOver: false,
  showGameOverDialog: false,
  boards: [],
  attacks: [],

  showOpponentBoard: false,
};

const activeGameSlice = createSlice({
  initialState,
  name: "activeGame",
  reducers: {
    setActiveGame(state, action: PayloadAction<ActiveGameState>) {
      state.activePlayerId = action.payload.activePlayerId;
      state.id = action.payload.id;
      state.boards = action.payload.boards;
      state.isGameStarted = action.payload.isGameStarted;
      state.isGameOver = action.payload.isGameOver;
      state.attacks = action.payload.attacks;
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
      const opponent = state.attacks.find(
        (board) => board.playerId !== playerId
      );
      if (!opponent) return;
      opponent.points.forEach((point) => {
        const foundPoint = points.find(
          (p) => p.point.x === point.point.x && p.point.y === point.point.y
        );
        if (
          !foundPoint ||
          foundPoint.shipPart === ShipPart.None ||
          foundPoint.shipPart === ShipPart.Unknown
        )
          return;
        console.log(
          "setting point (%d,%d) to %s",
          point.point.x,
          point.point.y,
          ShipPart[foundPoint.shipPart]
        );
        point.shipPart = foundPoint.shipPart;
      });
    },
    resetOpponentShipLocations: (state, action: PayloadAction<string>) => {
      const opponent = state.attacks.find(
        (board) => board.playerId !== action.payload
      );
      if (!opponent) return;
      opponent.points
        .filter((p) => p.attackResult === AttackResult.None)
        .forEach((point) => {
          point.shipPart = ShipPart.None;
        });
    },
    attackSquare: (state, action: PayloadAction<AttackResultPayload>) => {
      const {
        attackerPlayerId,
        hasShip,
        isGameOver,
        nextPlayerId,
        point,
        winnerPlayerId,
      } = action.payload;

      console.log("Sinking ship at ", point);
      const own = state.attacks.find((x) => x.playerId === attackerPlayerId);
      const enemy = state.boards.find((x) => x.playerId !== attackerPlayerId);
      if (!enemy || !own) return;
      const enemySquare = enemy.points.find(pointMatches(point));
      const attackedSquare = own.points.find(pointMatches(point));
      if (!enemySquare || !attackedSquare) return;
      // TODO Cannot show ship shape
      attackedSquare.shipPart = enemySquare.shipPart;
      const result = hasShip ? AttackResult.Hit : AttackResult.Miss;
      attackedSquare.attackResult = result;
      enemySquare.attackResult = result;

      console.log(`attacked square: ${ShipPart[attackedSquare.shipPart]}`);

      state.activePlayerId = nextPlayerId;
      state.winnerPlayerId = winnerPlayerId;
      state.isGameOver = isGameOver;
      if (isGameOver) {
        state.showGameOverDialog = true;
      }
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
} = activeGameSlice.actions;

export const activeGameReducer = activeGameSlice.reducer;
