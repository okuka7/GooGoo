// src/store/userSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

// Thunk to fetch any user by userId
export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (userId, thunkAPI) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "사용자 정보 로드 실패";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    currentUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "사용자 정보 로드 실패";
      });
  },
});

export const { clearCurrentUser } = userSlice.actions;

export default userSlice.reducer;
