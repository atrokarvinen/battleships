import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type AuthState = {
  isLoggedIn: boolean;
  isGuest: boolean;
  username?: string;
  userId?: string;
};

export const initialState: AuthState = {
  isLoggedIn: false,
  isGuest: false,
};

export type LoginPayload = {
  userId: string;
  username: string;
  isGuest: boolean;
};

const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    login(state, action: PayloadAction<LoginPayload>) {
      console.log("[Redux] Logged in");
      const { userId, username, isGuest } = action.payload;
      state.isLoggedIn = true;
      state.userId = userId;
      state.username = username;
      state.isGuest = isGuest;
    },
    logout(state) {
      console.log("[Redux] Logged out");
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = authSlice.actions;

export const authReducer = authSlice.reducer;
