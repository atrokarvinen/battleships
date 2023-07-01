import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BoardPoint, Point } from "../board/point";
import { AttackShipPayload } from "../board/redux/attackShipPayload";
import { ShipPart } from "../board/square-ship-part";
import { AttackResult } from "../board/square/attack-result";
import { Board } from "./boardSlice";

export type ActiveGamePlayer = {
  id: string;
  username: string;
};

export type Attack = {
  playerId: string;
  points: BoardPoint[];
};

export type ActiveGameState = {
  id: string;

  players: ActiveGamePlayer[];
  activePlayerId?: string;
  winnerPlayerId?: string;

  isGameStarted: boolean;
  isGameOver: boolean;
  showGameOverDialog: boolean;

  boards: Board[];
  attacks: Attack[];
};

export const initialState: ActiveGameState = {
  id: "1",
  players: [],
  isGameStarted: false,
  isGameOver: false,
  showGameOverDialog: false,
  boards: [],
  attacks: [],
};

const activeGameSlice = createSlice({
  initialState,
  name: "activeGame",
  reducers: {
    start(state) {
      console.log("[ActiveGame] starting new game...");

      // Make up starting player
      if (state.players.length < 2) {
        console.log(
          "Failed to start game. Player count < 2. Players:",
          state.players
        );
        return;
      }
      const startingPlayer =
        Math.random() < 0.5 ? state.players[0] : state.players[1];
      state.activePlayerId = startingPlayer.id;

      // Initialize boards
    },
    end(state) {},
    setActiveGame(state, action: PayloadAction<ActiveGameState>) {
      state.activePlayerId = action.payload.activePlayerId;
      state.id = action.payload.id;
      state.players = action.payload.players;
      state.boards = action.payload.boards;
      state.isGameStarted = action.payload.isGameStarted;
      state.isGameOver = action.payload.isGameOver;
      state.attacks = action.payload.attacks;
    },
    swapPlayerIdToPlay(state) {
      const playerIds = state.players.map((p) => p.id);
      const notActivePlayer = playerIds.find(
        (id) => id !== state.activePlayerId
      );
      state.activePlayerId = notActivePlayer!;
    },
    setIsGameOver(state, action: PayloadAction<boolean>) {
      const isOver = action.payload;
      console.log(`Setting game over to (${isOver})...`);
      state.isGameOver = isOver;
    },
    setWinnerPlayerId(state, action: PayloadAction<string | undefined>) {
      console.log(`Setting player id '${action.payload}' to winner...`);
      state.winnerPlayerId = action.payload;
    },
    openGameOverDialog(state) {
      console.log("opening game over dialog...");
      state.showGameOverDialog = true;
    },
    closeGameOverDialog(state) {
      console.log("closing game over dialog...");
      state.showGameOverDialog = false;
    },
    sinkShip: (state, action: PayloadAction<AttackShipPayload>) => {
      const { attackerPlayerId, point: sinkPoint } = action.payload;
      console.log("Sinking ship at ", sinkPoint);
      const enemy = state.boards.find(
        (board) => board.playerId !== attackerPlayerId
      );
      const own = state.attacks.find(
        (board) => board.playerId === attackerPlayerId
      );
      if (!enemy || !own) return;
      const enemySquare = enemy.points.find(pointMatches(sinkPoint));
      const attackedSquare = own.points.find(pointMatches(sinkPoint));
      if (!enemySquare || !attackedSquare) return;
      attackedSquare.shipPart = enemySquare.shipPart;
      attackedSquare.attackResult = AttackResult.Hit;
      attackedSquare.defendResult = AttackResult.Hit;
      enemySquare.attackResult = AttackResult.Hit;
      enemySquare.defendResult = AttackResult.Hit;

      console.log(`attacked square: ${ShipPart[attackedSquare.shipPart]}`);
    },
    missShip: (state, action: PayloadAction<AttackShipPayload>) => {
      const { attackerPlayerId, point: missPoint } = action.payload;
      console.log("Missing ship at ", missPoint);
      const enemy = state.boards.find(
        (board) => board.playerId !== attackerPlayerId
      );
      const own = state.attacks.find(
        (board) => board.playerId === attackerPlayerId
      );
      if (!own || !enemy) return;
      const enemySquare = enemy.points.find(pointMatches(missPoint));
      const attackedSquare = own.points.find(pointMatches(missPoint));
      if (!attackedSquare || !enemySquare) return;
      attackedSquare.attackResult = AttackResult.Miss;
      attackedSquare.defendResult = AttackResult.Miss;
      enemySquare.attackResult = AttackResult.Miss;
      enemySquare.defendResult = AttackResult.Miss;
    },
  },
});

export const pointMatches = (point: Point) => (boardPoint: BoardPoint) => {
  return boardPoint.point.x === point.x && boardPoint.point.y === point.y;
};

export const {
  start,
  end,
  setActiveGame,
  setIsGameOver,
  openGameOverDialog,
  closeGameOverDialog,
  setWinnerPlayerId,
  swapPlayerIdToPlay,
  sinkShip,
  missShip,
} = activeGameSlice.actions;

export const activeGameReducer = activeGameSlice.reducer;
