// src/components/common/Header.js

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { fetchUnreadCount } from "../../store/messageSlice"; // messageSlice 추가
import Modal from "../common/Modal";
import Login from "../auth/Login";
import Signup from "../auth/Signup";
import { FaUser, FaEnvelope } from "react-icons/fa"; // 메시지 아이콘 추가
import "./Header.css";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const unreadCount = useSelector((state) => state.messages.unreadCount);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const openLoginModal = () => {
    setIsSignup(false);
    setIsModalOpen(true);
  };

  const openSignupModal = () => {
    setIsSignup(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const switchToSignup = () => {
    setIsSignup(true);
  };

  const switchToLogin = () => {
    setIsSignup(false);
  };

  // 로그인 성공 시 모달 닫기
  useEffect(() => {
    if (isAuthenticated) {
      setIsModalOpen(false);
      dispatch(fetchUnreadCount()); // 로그인 시 읽지 않은 메시지 수 가져오기
    }
  }, [isAuthenticated, dispatch]);

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/" className="logo">
          구구
        </Link>
      </div>
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">홈</Link>
          </li>
          <li>
            <Link to="/board">게시판</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/mypage">마이페이지</Link>
              </li>
              <li>
                <Link to="/messages">
                  <FaEnvelope className="message-icon" />
                  {unreadCount > 0 && (
                    <span className="unread-badge">{unreadCount}</span>
                  )}
                </Link>
              </li>
              <li>
                <button onClick={handleLogout}>로그아웃</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button
                  className="icon-button"
                  onClick={openLoginModal}
                  aria-label="로그인"
                >
                  <FaUser />
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* 로그인/회원가입 모달 */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {isSignup ? (
          <Signup switchToLogin={switchToLogin} />
        ) : (
          <Login switchToSignup={switchToSignup} />
        )}
      </Modal>
    </header>
  );
};

export default Header;
