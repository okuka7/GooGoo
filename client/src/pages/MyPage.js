import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "../store/authSlice";
import { fetchUserPosts } from "../store/postSlice";
import UserInfo from "../components/user/UserInfo";
import { useNavigate } from "react-router-dom";
import ApplicantList from "../components/applications/ApplicationList";
import SurveyPopup from "../components/survey/SurveyPopup"; // ✅ 팝업 추가
import "./MyPage.css";

const MyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSurveyPopupOpen, setSurveyPopupOpen] = useState(false); // ✅ 팝업 상태 추가

  const { user, loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const {
    userPosts,
    loading: postsLoading,
    error: postsError,
  } = useSelector((state) => state.posts);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchUserInfo());
    }
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchUserPosts());
    }
  }, [dispatch, isAuthenticated, user]);

  if (loading || postsLoading) return <p>사용자 정보 로딩 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (postsError) return <p style={{ color: "red" }}>{postsError}</p>;

  const handleEdit = () => {
    navigate("/edit-profile");
  };

  const handleOpenSurveyPopup = () => {
    setSurveyPopupOpen(true); // ✅ 팝업 열기
  };

  const handleCloseSurveyPopup = () => {
    setSurveyPopupOpen(false); // ✅ 팝업 닫기
  };

  const handleSurveySubmit = () => {
    setSurveyPopupOpen(false);
    dispatch(fetchUserInfo()); // ✅ 설문 완료 후 사용자 정보 갱신
  };

  return (
    <div className="mypage-container">
      <h1>마이페이지</h1>
      {isAuthenticated && user ? (
        <>
          <UserInfo user={user} />
          <button className="edit-button" onClick={handleEdit}>
            정보 수정하기
          </button>
          <h2>작성한 글</h2>
          {userPosts.map((post) => (
            <div key={post.id} className="user-post-item">
              <h3>{post.title}</h3>
              <p>반려동물 종류: {post.animalType}</p>
              <ApplicantList postId={post.id} />
            </div>
          ))}
          <h2>설문 상태</h2>
          <p>
            {user.surveyCompleted
              ? "설문을 완료하셨습니다."
              : "설문을 완료하지 않으셨습니다."}
          </p>
          {!user.surveyCompleted && ( // ✅ 설문 미완료 시 버튼 표시
            <button className="survey-button" onClick={handleOpenSurveyPopup}>
              설문하러 가기
            </button>
          )}
        </>
      ) : (
        <p>사용자 정보를 불러오는 중입니다.</p>
      )}

      {/* 설문 팝업 */}
      <SurveyPopup
        isOpen={isSurveyPopupOpen}
        onClose={handleCloseSurveyPopup}
        onSubmit={handleSurveySubmit}
      />
    </div>
  );
};

export default MyPage;
