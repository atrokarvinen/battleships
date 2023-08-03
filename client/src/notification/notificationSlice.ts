import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type NotificationState = {
  errorMessage?: string;
};

export const initialState: NotificationState = {};

export const notificationSlice = createSlice({
  initialState,
  name: "notification",
  reducers: {
    showErrorToast: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    },
    closeErrorToast: (state) => {
      state.errorMessage = undefined;
    },
  },
});

export const { showErrorToast, closeErrorToast } = notificationSlice.actions;

export const notificationReducer = notificationSlice.reducer;
