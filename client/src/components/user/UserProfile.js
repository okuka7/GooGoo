// src/components/user/UserProfile.js

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById, clearCurrentUser } from "../../store/userSlice";
import UserInfo from "./UserInfo";
import { useParams } from "react-router-dom";
import "./UserProfile.css"; // 추가

const UserProfile = () => {
  const { username } = useParams(); // URL에서 userId 추출
  const dispatch = useDispatch();

  const { currentUser, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    if (username) {
      dispatch(fetchUserById(username));
    }
    return () => {
      dispatch(clearCurrentUser());
    };
  }, [dispatch, username]);

  if (loading) return <p>사용자 정보 로딩 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!currentUser) return <p>사용자 정보를 불러오는 중입니다.</p>;

  return <UserInfo user={currentUser} />;
};

export default UserProfile;
