import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import { PlayerJoinedPayload, PlayerLeftPayload } from "../io/models";
import { GameRoom } from "../lobby/gameRoom";

export interface GameState {
  byId: { [id: string]: GameRoom };
  allIds: string[];
}

export const initialState: GameState = {
  byId: {},
  allIds: [],
};

export const gameRoomSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    addNewGameRoom: (state, action: PayloadAction<GameRoom>) => {
      const game = action.payload;
      console.log("[Redux] Adding new game:", game);
      state.byId[game.id] = game;
      if (!state.allIds.includes(game.id)) {
        state.allIds.push(game.id);
      }
    },
    setGameRooms: (state, action: PayloadAction<GameRoom[]>) => {
      const gameRooms = action.payload;
      state.byId = _.keyBy(gameRooms, (game) => game.id);
      state.allIds = gameRooms.map((game) => game.id);
    },
    deleteGameRoom: (state, action: PayloadAction<string>) => {
      const gameId = action.payload;
      console.log("[Redux] Deleting game " + gameId);
      state.byId = _.omitBy(state.byId, (x) => x.id === gameId);
      state.allIds = state.allIds.filter((id) => id !== gameId);
    },
    joinGame: (state, action: PayloadAction<PlayerJoinedPayload>) => {
      const { gameId, player } = action.payload;
      console.log("[Redux] Joining game " + gameId);
      const game = state.byId[gameId];
      if (!game) return;
      game.players.push({
        id: player.id,
        username: player.username,
      });
    },
    leaveGame: (state, action: PayloadAction<PlayerLeftPayload>) => {
      const { gameId, playerId } = action.payload;
      console.log("[Redux] Leaving game " + gameId);
      const game = state.byId[gameId];
      if (!game) return state;
      game.players = game.players.filter((p) => p.id !== playerId);
    },
  },
});

export const {
  addNewGameRoom,
  setGameRooms,
  deleteGameRoom,
  joinGame,
  leaveGame,
} = gameRoomSlice.actions;

export const gameRoomReducer = gameRoomSlice.reducer;
