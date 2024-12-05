// src/store/applicationSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

// Thunk for applying to a post
export const applyForPost = createAsyncThunk(
  "applications/applyForPost",
  async (postId, thunkAPI) => {
    try {
      const response = await api.post(`/applications/${postId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "분양 신청 실패";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

// Thunk for fetching applications by post
export const fetchApplicationsByPost = createAsyncThunk(
  "applications/fetchApplicationsByPost",
  async (postId, thunkAPI) => {
    try {
      const response = await api.get(`/applications/posts/${postId}`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "신청자 목록 로드 실패";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

// Thunk for updating application status
export const updateApplicationStatus = createAsyncThunk(
  "applications/updateApplicationStatus",
  async ({ applicationId, status }, thunkAPI) => {
    try {
      // 상태를 요청 본문으로 전송 (백엔드가 이를 지원하는지 확인 필요)
      const response = await api.post(`/applications/${applicationId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "신청 상태 업데이트 실패";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    applications: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Apply for Post
      .addCase(applyForPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyForPost.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.push(action.payload);
      })
      .addCase(applyForPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "분양 신청 실패";
      })

      // Fetch Applications by Post
      .addCase(fetchApplicationsByPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationsByPost.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchApplicationsByPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "신청자 목록 로드 실패";
      })

      // Update Application Status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedApplication = action.payload;
        const index = state.applications.findIndex(
          (app) => app.id === updatedApplication.id
        );
        if (index !== -1) {
          state.applications[index] = updatedApplication;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "신청 상태 업데이트 실패";
      });
  },
});

export default applicationSlice.reducer;
