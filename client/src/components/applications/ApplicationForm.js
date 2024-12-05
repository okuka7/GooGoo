// src/components/applications/ApplicationForm.js

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyForPost } from "../../store/applicationSlice"; // ✅ 올바른 Thunk 임포트
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./ApplicationForm.css";

const ApplicationForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.applications);
  const { postId } = useParams();
  const { user } = useAuth(); // 사용자 정보 가져오기

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(applyForPost(postId)) // ✅ 올바른 Thunk 사용
      .unwrap()
      .then(() => {
        alert("신청이 완료되었습니다.");
        navigate(`/posts/${postId}`);
      })
      .catch((err) => alert(err));
  };

  return (
    <div>
      <h2>분양 신청</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>게시물 ID:</label>
          <input type="text" name="postId" value={postId} disabled />
        </div>
        <div>
          <label>신청자 ID:</label>
          <input
            type="text"
            name="applicantId"
            value={user?.id || ""}
            disabled
          />
        </div>
        {loading && <p>신청 중...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          신청하기
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;
