import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type AuthState = {
  isLoggedIn: boolean;
  username?: string;
  userId?: string;
};

export const initialState: AuthState = {
  isLoggedIn: false,
};

export type LoginPayload = {
  userId: string;
  username: string;
};

const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    login(state, action: PayloadAction<LoginPayload>) {
      console.log("Logged in");
      const { userId, username } = action.payload;
      state.isLoggedIn = true;
      state.userId = userId;
      state.username = username;
    },
    logout(state) {
      console.log("Logged out");
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = authSlice.actions;

export const authReducer = authSlice.reducer;
