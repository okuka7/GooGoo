// src/store/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

// 로그인 thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, thunkAPI) => {
    try {
      // URLSearchParams를 사용하여 폼 데이터 생성
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      // 로그인 요청: application/x-www-form-urlencoded 형식으로 전송
      const response = await api.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = response.data;
      localStorage.setItem("token", data.token);

      // 사용자 정보 요청
      const userInfoResponse = await api.get("/users/me");
      return { token: data.token, user: userInfoResponse.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "로그인 실패";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

// Thunk for user signup
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ username, password, nickname }, thunkAPI) => {
    try {
      const response = await api.post("/auth/signup", {
        username,
        nickname,
        password,
      });
      const data = response.data;
      localStorage.setItem("token", data.token);
      // 회원가입 후 사용자 정보 받아오기
      const userInfoResponse = await api.get("/users/me");
      return { token: data.token, user: userInfoResponse.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "회원가입 실패";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

// Thunk for fetching user info
export const fetchUserInfo = createAsyncThunk(
  "auth/fetchUserInfo",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/users/me");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "사용자 정보 로드 실패";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
    user: null,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "로그인 실패";
      })
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "회원가입 실패";
      })
      // Fetch User Info
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "사용자 정보 로드 실패";
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
