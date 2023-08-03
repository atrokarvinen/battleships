import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { AttackResult, BoardPoint } from "../board/models";
import { generateEmptyBoardPoints } from "../board/redux/board-utils";
import { AddShipPayload, AttackShipPayload } from "./models";

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
  initialState,
  reducers: {
    addShip: (state, action: PayloadAction<AddShipPayload>) => {
      console.log("not implemented");
    },
    attackShip: (state, action: PayloadAction<AttackShipPayload>) => {
      console.log("not implemented");
    },

    setBoardState: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
    },
    resetBoard: (state) => {
      state.boards.forEach((board) => {
        board.points.forEach((p) => {
          p.attackResult = AttackResult.None;
          p.shipPart = undefined;
        });
      });
    },
  },
});

export const { addShip, resetBoard, attackShip, setBoardState } =
  boardSlice.actions;

export default boardSlice.reducer;
