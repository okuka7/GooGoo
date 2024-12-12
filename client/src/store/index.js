// src/store/index.js

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import postReducer from "./postSlice";
import userReducer from "./userSlice"; // 새로 추가
import applicationReducer from "./applicationSlice"; // 추가
import surveyReducer from "./surveySlice";
import messageReducer from "./messageSlice"; // 추가
// 필요한 경우 다른 슬라이스도 추가

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    users: userReducer, // 새로 추가
    applications: applicationReducer, // 추가
    survey: surveyReducer,
    messages: messageReducer, // 추가

    // 다른 슬라이스 리듀서 추가
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
