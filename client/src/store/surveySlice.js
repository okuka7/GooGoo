// src/store/surveySlice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api"; // ✅ axios 인스턴스 가져오기

// 설문 데이터 가져오기
export const fetchSurveyByUserId = createAsyncThunk(
  "survey/fetchByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      console.log("Fetching survey for User ID:", userId);
      const response = await api.get(`/survey/user/${userId}`); // ✅ API 호출
      return response.data; // ✅ JSON 데이터 반환
    } catch (err) {
      // 에러 처리
      if (err.response && err.response.data) {
        console.error("API Error:", err.response.data);
        return rejectWithValue(err.response.data.error);
      }
      console.error("Fetch Survey Error:", err.message);
      return rejectWithValue("설문 데이터를 가져오는 중 문제가 발생했습니다.");
    }
  }
);

// 설문 데이터 업데이트하기
export const updateSurvey = createAsyncThunk(
  "survey/updateSurvey",
  async (surveyData, { rejectWithValue }) => {
    try {
      const { userId, ...data } = surveyData;
      console.log("Updating survey for User ID:", userId);
      const response = await api.put(`/survey/user/${userId}`, data); // ✅ API 호출
      return response.data; // ✅ 업데이트된 데이터 반환
    } catch (err) {
      // 에러 처리
      if (err.response && err.response.data) {
        console.error("API Error:", err.response.data);
        return rejectWithValue(err.response.data.error);
      }
      console.error("Update Survey Error:", err.message);
      return rejectWithValue(
        "설문 데이터를 업데이트하는 중 문제가 발생했습니다."
      );
    }
  }
);

const surveySlice = createSlice({
  name: "survey",
  initialState: {
    surveyData: null,
    loading: false,
    error: null,
    updating: false,
    updateError: null,
  },
  reducers: {
    clearSurveyData(state) {
      state.surveyData = null;
      state.error = null;
      state.loading = false;
      state.updating = false;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Survey
      .addCase(fetchSurveyByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSurveyByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.surveyData = action.payload;
      })
      .addCase(fetchSurveyByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "설문 데이터를 가져오는 데 실패했습니다.";
      })
      // Update Survey
      .addCase(updateSurvey.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateSurvey.fulfilled, (state, action) => {
        state.updating = false;
        state.surveyData = action.payload;
      })
      .addCase(updateSurvey.rejected, (state, action) => {
        state.updating = false;
        state.updateError =
          action.payload || "설문 데이터를 업데이트하는 데 실패했습니다.";
      });
  },
});

export const { clearSurveyData } = surveySlice.actions;
export default surveySlice.reducer;
