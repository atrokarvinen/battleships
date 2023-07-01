import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BoatPart } from "../board/cell-boat-part";
import { AttackResult } from "../board/cell/attack-result";
import { BoardPoint, Point } from "../board/point";
import { GuessBoatPayload } from "../board/redux/guessBoatPayload";
import { Board } from "./boardSlice";

export type ActiveGamePlayer = {
  id: string;
  username: string;
};

export type Guess = {
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
  guesses: Guess[];
};

export const initialState: ActiveGameState = {
  id: "1",
  players: [],
  isGameStarted: false,
  isGameOver: false,
  showGameOverDialog: false,
  boards: [],
  guesses: [],
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
      state.guesses = action.payload.guesses;
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
    sinkShip: (state, action: PayloadAction<GuessBoatPayload>) => {
      const { guesserPlayerId, point: sinkPoint } = action.payload;
      console.log("Sinking ship at ", sinkPoint);
      const enemy = state.boards.find(
        (board) => board.playerId !== guesserPlayerId
      );
      const own = state.guesses.find(
        (board) => board.playerId === guesserPlayerId
      );
      if (!enemy || !own) return;
      const enemyCell = enemy.points.find(pointMatches(sinkPoint));
      const guessedCell = own.points.find(pointMatches(sinkPoint));
      if (!enemyCell || !guessedCell) return;
      guessedCell.boatPart = enemyCell.boatPart;
      guessedCell.attackResult = AttackResult.Hit;
      guessedCell.defendResult = AttackResult.Hit;
      enemyCell.attackResult = AttackResult.Hit;
      enemyCell.defendResult = AttackResult.Hit;

      console.log(`guessed cell: ${BoatPart[guessedCell.boatPart]}`);
    },
    missShip: (state, action: PayloadAction<GuessBoatPayload>) => {
      const { guesserPlayerId, point: missPoint } = action.payload;
      console.log("Missing ship at ", missPoint);
      const enemy = state.boards.find(
        (board) => board.playerId !== guesserPlayerId
      );
      const own = state.guesses.find(
        (board) => board.playerId === guesserPlayerId
      );
      if (!own || !enemy) return;
      const enemyCell = enemy.points.find(pointMatches(missPoint));
      const guessedCell = own.points.find(pointMatches(missPoint));
      if (!guessedCell || !enemyCell) return;
      guessedCell.attackResult = AttackResult.Miss;
      guessedCell.defendResult = AttackResult.Miss;
      enemyCell.attackResult = AttackResult.Miss;
      enemyCell.defendResult = AttackResult.Miss;
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
