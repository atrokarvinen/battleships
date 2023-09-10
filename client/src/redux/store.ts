import { PreloadedState, configureStore } from "@reduxjs/toolkit";
import {
  initialState as initialNotificationState,
  notificationReducer,
} from "../notification/notificationSlice";
import {
  initialState as initialShipBuilderState,
  shipBuilderReducer,
} from "../ship-builder/redux/shipBuilderSlice";
import {
  activeGameReducer,
  initialState as initialActiveGameState,
} from "./activeGameSlice";
import { authReducer, initialState as initialAuthState } from "./authSlice";
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
  gameRoom: gameRoomReducer,
  notification: notificationReducer,
  players: playerReducer,
  shipBuilder: shipBuilderReducer,
};

export const store = configureStore({
  reducer: rootReducer,
});

export const preloadedState: PreloadedState<RootState> = {
  activeGame: initialActiveGameState,
  auth: initialAuthState,
  gameRoom: initialGameState,
  notification: initialNotificationState,
  players: initialPlayerState,
  shipBuilder: initialShipBuilderState,
};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
