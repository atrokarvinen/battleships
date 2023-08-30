import { PreloadedState, configureStore } from "@reduxjs/toolkit";
import {
  initialState as initialNotificationState,
  notificationReducer,
} from "../notification/notificationSlice";
import {
  activeGameReducer,
  initialState as initialActiveGameState,
} from "./activeGameSlice";
import { authReducer, initialState as initialAuthState } from "./authSlice";
import { chatReducer, initialState as initialChatState } from "./chatSlice";
import {
  gameRoomReducer,
  initialState as initialGameState,
} from "./gameRoomSlice";
import {
  initialState as initialPlayerState,
  playerReducer,
} from "./playerSlice";

export const rootReducer = {
  activeGame: activeGameReducer,
  auth: authReducer,
  chat: chatReducer,
  gameRoom: gameRoomReducer,
  notification: notificationReducer,
  players: playerReducer,
};

export const store = configureStore({
  reducer: rootReducer,
});

export const preloadedState: PreloadedState<RootState> = {
  activeGame: initialActiveGameState,
  auth: initialAuthState,
  chat: initialChatState,
  gameRoom: initialGameState,
  notification: initialNotificationState,
  players: initialPlayerState,
};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
