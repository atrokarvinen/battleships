import { PreloadedState, configureStore } from "@reduxjs/toolkit";
import boardReducer, { initialState as initialBoardState } from "./boardSlice";
import {
  gameRoomReducer,
  initialState as initialGameState,
} from "./gameRoomSlice";
import {
  initialState as initialPlayerState,
  playerReducer,
} from "./playerSlice";
import { authReducer, initialState as initialAuthState } from "./authSlice";
import { chatReducer, initialState as initialChatState } from "./chatSlice";
import {
  activeGameReducer,
  initialState as initialActiveGameState,
} from "./activeGameSlice";

export const rootReducer = {
  board: boardReducer,
  gameRoom: gameRoomReducer,
  activeGame: activeGameReducer,
  players: playerReducer,
  auth: authReducer,
  chat: chatReducer,
};

export const store = configureStore({
  reducer: rootReducer,
});

export const preloadedState: PreloadedState<RootState> = {
  auth: initialAuthState,
  board: initialBoardState,
  gameRoom: initialGameState,
  activeGame: initialActiveGameState,
  players: initialPlayerState,
  chat: initialChatState,
};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
