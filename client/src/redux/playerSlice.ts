import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type Player = {
  id: string;
  username: string;
  gamesJoined: string[];
};

export type PlayerState = {
  playerIds: string[];
  players: Player[];
};

export type GameJoinedPayload = {
  playerId: string;
  gameId: string;
};

export const initialState: PlayerState = {
  playerIds: [],
  players: [],
};

const playerSlice = createSlice({
  initialState,
  name: "player",
  reducers: {
    addPlayer(state, action: PayloadAction<Player>) {
      const player = action.payload;
      state.playerIds.push(player.id);
      state.players.push(player);
    },
    removePlayer(state, action: PayloadAction<string>) {
      const playerId = action.payload;
      state.playerIds = state.playerIds.filter((id) => id !== playerId);
      state.players = state.players.filter((p) => p.id !== playerId);
    },
    addPlayerToGame(state, action: PayloadAction<GameJoinedPayload>) {
      const { gameId, playerId } = action.payload;
      const player = state.players.find((p) => p.id === playerId);
      if (!player) return state;
      player.gamesJoined.push(gameId);
    },
    removePlayerFromGame(state, action: PayloadAction<GameJoinedPayload>) {
      const { gameId, playerId } = action.payload;
      const player = state.players.find((p) => p.id === playerId);
      if (!player) return state;
      player.gamesJoined = player.gamesJoined.filter((id) => id !== gameId);
    },
  },
});

export const {
  addPlayer,
  removePlayer,
  addPlayerToGame,
  removePlayerFromGame,
} = playerSlice.actions;

export const playerReducer = playerSlice.reducer;
