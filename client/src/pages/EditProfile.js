// src/pages/EditProfile.js

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserInfo, fetchUserInfo } from "../store/authSlice";
import "./EditProfile.css";

const EditProfile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      setNickname(user.nickname);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    dispatch(updateUserInfo({ nickname, password }));
  };

  return (
    <div className="edit-profile-container">
      <h1>프로필 수정</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nickname">닉네임</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">새 비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 변경하려면 입력하세요"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호를 다시 입력하세요"
          />
        </div>
        {loading && <p>업데이트 중...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">수정 완료</button>
      </form>
    </div>
  );
};

export default EditProfile;
