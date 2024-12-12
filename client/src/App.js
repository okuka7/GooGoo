// src/App.js

import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import Board from "./pages/Board";
import MyPage from "./pages/MyPage";
import MyAdoptions from "./pages/MyAdoptions";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import UserProfile from "./components/user/UserProfile";
import PrivateRoute from "./components/common/PrivateRoute";
import PostDetail from "./components/posts/PostDetail";
import PostForm from "./components/posts/PostForm";
import SurveyPopup from "./components/survey/SurveyPopup";
import EditProfile from "./pages/EditProfile";
import MessagePage from "./pages/MessagePage";
import MessageListPage from "./pages/MessageListPage"; // 추가
import "./styles/main.css";
import api from "./api/api";
import { fetchUnreadCount } from "./store/messageSlice";
import { connectWebSocket, disconnectWebSocket } from "./utils/websocket"; // 추가

function App() {
  const dispatch = useDispatch();
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkSurveyStatus = async () => {
      if (isAuthenticated) {
        try {
          const response = await api.get("/api/users/me");
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

  // 메시지 알림 갱신
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUnreadCount());
    }
  }, [isAuthenticated, dispatch]);

  // WebSocket 연결 관리
  useEffect(() => {
    if (isAuthenticated) {
      connectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [isAuthenticated]);

  return (
    <div className="app-container">
      <Header />
      <div className="container">
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
            path="/edit-profile"
            element={
              <PrivateRoute>
                <EditProfile />
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
          <Route
            path="/my-adoptions"
            element={
              <PrivateRoute>
                <MyAdoptions />
              </PrivateRoute>
            }
          />
          {/* 메시지 목록 페이지로 이동 */}
          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <MessageListPage />
              </PrivateRoute>
            }
          />
          {/* 특정 상대와의 대화 페이지 */}
          <Route
            path="/messages/:otherUsername"
            element={
              <PrivateRoute>
                <MessagePage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />

      {/* 전역 설문 팝업 */}
      <SurveyPopup
        isOpen={isSurveyOpen}
        onSubmit={handleSurveySubmit}
        onClose={handleSurveyClose}
      />
    </div>
  );
}

export default App;
