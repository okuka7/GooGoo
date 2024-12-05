// src/components/Header.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import Modal from "../common/Modal";
import Login from "../auth/Login";
import Signup from "../auth/Signup";
import { FaUser } from "react-icons/fa";
import api from "../../api/api";
import "./Header.css";

const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

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
    }
  }, [isAuthenticated]);

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
