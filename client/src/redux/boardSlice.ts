import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { BoardPoint, Point } from "../board/point";
import { AddShipPayload } from "../board/redux/addShipPayload";
import { AttackShipPayload } from "../board/redux/attackShipPayload";
import { generateEmptyBoardPoints } from "../board/redux/board-utils";
import { ShipPart } from "../board/square-ship-part";
import { AttackResult } from "../board/square/attack-result";

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
          p.defendResult = AttackResult.None;
          p.shipPart = ShipPart.None;
        });
      });
    },
  },
});

const pointMatches = (point: Point) => (boardPoint: BoardPoint) => {
  return boardPoint.point.x === point.x && boardPoint.point.y === point.y;
};

export const { addShip, resetBoard, attackShip, setBoardState } =
  boardSlice.actions;

export default boardSlice.reducer;
