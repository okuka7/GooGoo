// src/store/messageSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

// Thunk for sending a message
export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async (messageData, thunkAPI) => {
    try {
      const response = await api.post("/messages", messageData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "메시지 전송 실패";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

// Thunk for fetching messages with a user
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (recipientUsername, thunkAPI) => {
    try {
      const response = await api.get(`/messages/${recipientUsername}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "메시지 로드 실패";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "메시지 전송 실패";
      })
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "메시지 로드 실패";
      });
  },
});

export const { clearMessages } = messageSlice.actions;

export default messageSlice.reducer;
