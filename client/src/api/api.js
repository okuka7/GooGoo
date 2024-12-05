// src/api/api.js

import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8081/api";

const api = axios.create({
  baseURL: API_URL,
});

// 요청 인터셉터: 토큰 첨부
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
