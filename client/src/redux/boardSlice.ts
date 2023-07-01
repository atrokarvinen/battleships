import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { BoatPart } from "../board/cell-boat-part";
import { AttackResult } from "../board/cell/attack-result";
import { BoardPoint, Point } from "../board/point";
import { AddBoatPayload } from "../board/redux/addBoatPayload";
import { generateEmptyBoardPoints } from "../board/redux/board-utils";
import { GuessBoatPayload } from "../board/redux/guessBoatPayload";

export interface Board {
  points: BoardPoint[];
  playerId: string;
}

export interface BoardState {
  boards: Board[];
}

export const initialState: BoardState = {
  boards: [
    { points: generateEmptyBoardPoints(), playerId: "1" },
    {
      points: generateEmptyBoardPoints(),
      playerId: "1",
    },
    { points: generateEmptyBoardPoints(), playerId: "2" },
    {
      points: generateEmptyBoardPoints(),
      playerId: "2",
    },
  ],
};

export const boardSlice = createSlice({
  name: "board",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addBoat: (state, action: PayloadAction<AddBoatPayload>) => {
      console.log("not implemented");
    },
    guessBoat: (state, action: PayloadAction<GuessBoatPayload>) => {
      console.log("not implemented");
    },

    setBoardState: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
    },
    resetBoard: (state) => {
      state.boards.forEach((board) => {
        board.points.forEach((p) => {
          p.attackResult = AttackResult.None;
          p.defendResult = AttackResult.None;
          p.boatPart = BoatPart.None;
        });
      });
    },
  },
});

const pointMatches = (point: Point) => (boardPoint: BoardPoint) => {
  return boardPoint.point.x === point.x && boardPoint.point.y === point.y;
};

export const { addBoat, resetBoard, guessBoat, setBoardState } =
  boardSlice.actions;

export default boardSlice.reducer;
