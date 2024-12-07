import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

// 로그인 thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, thunkAPI) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await api.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = response.data;
      localStorage.setItem("token", data.token);

      const userInfoResponse = await api.get("/users/me");
      return { token: data.token, user: userInfoResponse.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "로그인 실패";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

// 회원가입 thunk
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

      const userInfoResponse = await api.get("/users/me");
      return { token: data.token, user: userInfoResponse.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "회원가입 실패";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

// 사용자 정보 가져오기 thunk
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

// 프로필 정보 업데이트 thunk
export const updateUserInfo = createAsyncThunk(
  "auth/updateUserInfo",
  async ({ nickname, password }, thunkAPI) => {
    try {
      const updateData = { nickname };
      if (password) {
        updateData.password = password;
      }

      const response = await api.put("/users/me", updateData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "프로필 수정 실패";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

// 설문 데이터 가져오기 thunk
export const fetchSurvey = createAsyncThunk(
  "auth/fetchSurvey",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/survey");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "설문 데이터 로드 실패";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

// 설문 데이터 업데이트 thunk
export const updateSurvey = createAsyncThunk(
  "auth/updateSurvey",
  async (surveyData, thunkAPI) => {
    try {
      const response = await api.put("/survey", surveyData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "설문 수정 실패";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

// Slice 정의
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
    user: null,
    survey: null,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.survey = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // 로그인 처리
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

      // 회원가입 처리
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

      // 사용자 정보 가져오기 처리
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "사용자 정보 로드 실패";
        state.isAuthenticated = false;
      })

      // 프로필 정보 업데이트 처리
      .addCase(updateUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "프로필 수정 실패";
      })

      // 설문 데이터 가져오기 처리
      .addCase(fetchSurvey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSurvey.fulfilled, (state, action) => {
        state.loading = false;
        state.survey = action.payload;
      })
      .addCase(fetchSurvey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "설문 데이터 로드 실패";
      })

      // 설문 데이터 업데이트 처리
      .addCase(updateSurvey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSurvey.fulfilled, (state, action) => {
        state.loading = false;
        state.survey = action.payload;
      })
      .addCase(updateSurvey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "설문 수정 실패";
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
