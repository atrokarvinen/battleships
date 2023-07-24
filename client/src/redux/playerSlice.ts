import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

export type Player = {
  id: string;
  username: string;
  gamesJoined: string[];
};

export type PlayerState = {
  byId: { [id: string]: Player };
  allIds: string[];
};

export type GameJoinedPayload = {
  playerId: string;
  gameId: string;
};

export const initialState: PlayerState = {
  byId: {},
  allIds: [],
};

const playerSlice = createSlice({
  initialState,
  name: "player",
  reducers: {
    addPlayer(state, action: PayloadAction<Player>) {
      const player = action.payload;
      state.byId[player.id] = player;
      if (!state.allIds.find((id) => id === player.id)) {
        state.allIds.push(player.id);
      }
    },
    addPlayers(state, action: PayloadAction<Player[]>) {
      const players = action.payload;
      state.byId = _.keyBy(players, (player) => player.id);
      state.allIds = players.map((player) => player.id);
    },
    removePlayer(state, action: PayloadAction<string>) {
      const playerId = action.payload;
      state.byId = _.omitBy(state.byId, (x) => x.id === playerId);
      state.allIds = state.allIds.filter((id) => id !== playerId);
    },
    addPlayerToGame(state, action: PayloadAction<GameJoinedPayload>) {
      const { gameId, playerId } = action.payload;
      const player = state.byId[playerId];
      if (!player) return state;
      player.gamesJoined.push(gameId);
    },
    removePlayerFromGame(state, action: PayloadAction<GameJoinedPayload>) {
      const { gameId, playerId } = action.payload;
      const player = state.byId[playerId];
      if (!player) return state;
      player.gamesJoined = player.gamesJoined.filter((id) => id !== gameId);
    },
  },
});

export const {
  addPlayer,
  addPlayers,
  removePlayer,
  addPlayerToGame,
  removePlayerFromGame,
} = playerSlice.actions;

export const playerReducer = playerSlice.reducer;
