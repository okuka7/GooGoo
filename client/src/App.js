// src/App.js

import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import Board from "./pages/Board";
import MyPage from "./pages/MyPage";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import UserProfile from "./components/user/UserProfile";
import PrivateRoute from "./components/common/PrivateRoute";
import PostDetail from "./components/posts/PostDetail";
import PostForm from "./components/posts/PostForm";
import SurveyPopup from "./components/survey/SurveyPopup";
import "./styles/main.css";
import api from "./api/api";

function App() {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkSurveyStatus = async () => {
      if (isAuthenticated) {
        try {
          const response = await api.get("/users/me");
          const { surveyCompleted } = response.data;

          const surveyDismissed = localStorage.getItem("surveyDismissed");

          if (!surveyCompleted && !surveyDismissed) {
            setIsSurveyOpen(true);
          }
        } catch (error) {
          console.error("설문 상태 확인 오류:", error);
        }
      }
    };

    checkSurveyStatus();
  }, [isAuthenticated]);

  const handleSurveySubmit = () => {
    setIsSurveyOpen(false);
    localStorage.setItem("surveyDismissed", "true");
  };

  const handleSurveyClose = () => {
    setIsSurveyOpen(false);
    localStorage.setItem("surveyDismissed", "true");
  };

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board" element={<Board />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/posts/:postId" element={<PostDetail />} />
        <Route
          path="/posts/new"
          element={
            <PrivateRoute>
              <PostForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/mypage"
          element={
            <PrivateRoute>
              <MyPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/:username"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />
        {/* 인증되지 않은 사용자에게 기본 경로 리디렉션 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />

      {/* SurveyPopup 추가 */}
      <SurveyPopup
        isOpen={isSurveyOpen}
        onSubmit={handleSurveySubmit}
        onClose={handleSurveyClose}
      />
    </div>
  );
}

export default App;
