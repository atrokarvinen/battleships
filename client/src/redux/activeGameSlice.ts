import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BoardPoint, Point } from "../board/models";
import { GameState, PlayerDTO } from "../game/api/apiModel";
import { TransformShipPayload } from "../ship-builder/api/api";
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

  state: GameState;
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

  state: GameState.UNKNOWN,
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
      state.state = action.payload.state;
      state.isGameStarted = action.payload.isGameStarted;
      state.isGameOver = action.payload.isGameOver;
      state.players = action.payload.players;
      state.winnerPlayerId = action.payload.winnerPlayerId;
      state.lastAttack = undefined;
    },
    setPlayerReady(state, action: PayloadAction<string>) {
      const player = state.players.find((p) => p.playerId === action.payload);
      if (!player) return state;
      player.placementsReady = true;
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
    attackSquare: (state, action: PayloadAction<AttackResultPayload>) => {
      const {
        hasShip,
        isGameOver,
        nextPlayerId,
        point,
        winnerPlayerId,
        attackerPlayerId: attackerId,
      } = action.payload;

      console.log("Sinking ship at ", point);
      const attacker = state.players.find((p) => p.playerId === attackerId);
      const defender = state.players.find((p) => p.playerId !== attackerId);
      if (!attacker || !defender) return;

      attacker.attacks.push(point);
      if (hasShip) {
        // Just use artificial id since full enemy ship information is unknown
        const id = defender.ownShips.length + 1;
        defender.ownShips.push({
          id: id.toString(),
          start: point,
          length: 1,
          isVertical: false,
        });
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
    transformShip: (state, action: PayloadAction<TransformShipPayload>) => {
      const { playerId, ship } = action.payload;
      let shipToTransform = state.players
        .find((p) => playerId === p.playerId)
        ?.ownShips.find((s) => s.id === ship.id);

      if (!shipToTransform) return;

      shipToTransform.start = ship.start;
      shipToTransform.isVertical = ship.isVertical;
    },
  },
});

export const pointMatches = (point: Point) => (boardPoint: BoardPoint) => {
  return boardPoint.point.x === point.x && boardPoint.point.y === point.y;
};
export const pointMatchesToPoint =
  (pointA: Point | undefined) => (pointB: Point | undefined) => {
    if (!!pointA && !!pointB) {
      return pointB.x === pointA.x && pointB.y === pointA.y;
    }
    return pointA === pointB;
  };

export const {
  setActiveGame,
  setPlayerReady,
  setIsGameOver,
  closeGameOverDialog,
  attackSquare,
  gameOver,
  transformShip,
} = activeGameSlice.actions;

export const activeGameReducer = activeGameSlice.reducer;
