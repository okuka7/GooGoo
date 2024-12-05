// src/components/user/UserInfo.js

import React from "react";
import "./UserInfo.css";

const UserInfo = ({ user }) => {
  return (
    <div className="user-info">
      <h2>사용자 정보</h2>
      <p>아이디: {user.username}</p>
      <p>닉네임: {user.nickname}</p>
      <p>설문 상태: {user.surveyCompleted ? "완료" : "미완료"}</p>
    </div>
  );
};

export default UserInfo;
