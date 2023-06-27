import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type ChatMessage = {
  text: string;
  sender: string;
  senderId: string;
  timestamp: Date;
};

export type ChatState = {
  messages: ChatMessage[];
};

export const initialState: ChatState = {
  messages: [],
};

const chatSlice = createSlice({
  initialState,
  name: "chat",
  reducers: {
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
});

export const { addMessage, clearMessages } = chatSlice.actions;

export const chatReducer = chatSlice.reducer;
