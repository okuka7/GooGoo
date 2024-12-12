// src/pages/MyPage.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "../store/authSlice";
import { fetchUserPosts } from "../store/postSlice";
import UserInfo from "../components/user/UserInfo";
import { useNavigate } from "react-router-dom";
import ApplicantList from "../components/applications/ApplicationList";
import SurveyPopup from "../components/survey/SurveyPopup";
import "./MyPage.css";

const MyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSurveyPopupOpen, setSurveyPopupOpen] = useState(false);

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
  if (error) return <p className="error-message">{error}</p>;
  if (postsError) return <p className="error-message">{postsError}</p>;

  const handleEdit = () => {
    navigate("/edit-profile");
  };

  const handleOpenSurveyPopup = () => {
    setSurveyPopupOpen(true);
  };

  const handleCloseSurveyPopup = () => {
    setSurveyPopupOpen(false);
  };

  const handleSurveySubmit = () => {
    setSurveyPopupOpen(false);
    dispatch(fetchUserInfo()); // 설문 완료 후 사용자 정보 갱신
  };

  return (
    <div className="mypage-container">
      <h1 className="mypage-container__title">마이페이지</h1>
      {isAuthenticated && user ? (
        <div className="mypage-content">
          {/* 사용자 정보 섹션 */}
          <section className="mypage-section user-info-section">
            <div className="mypage-section__header">
              <h2>내 정보</h2>
              <button className="button button--edit" onClick={handleEdit}>
                정보 수정하기
              </button>
            </div>
            <div className="mypage-section__content">
              <UserInfo user={user} />
              {user.responsibleOwner && (
                <p className="responsible-owner-badge">
                  🎉 책임감 있는 반려인 인증 완료!
                </p>
              )}
            </div>
          </section>

          {/* 작성한 글 섹션 */}
          <section className="mypage-section user-posts-section">
            <div className="mypage-section__header">
              <h2>작성한 글</h2>
            </div>
            <div className="mypage-section__content">
              {userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <div key={post.id} className="user-posts__item">
                    <h3 className="user-posts__item-title">{post.title}</h3>
                    <p className="user-posts__item-description">
                      반려동물 종류: {post.animalType}
                    </p>
                    <ApplicantList postId={post.id} />
                  </div>
                ))
              ) : (
                <p>작성한 글이 없습니다.</p>
              )}
            </div>
          </section>

          {/* 설문 상태 섹션 */}
          <section className="mypage-section survey-section">
            <div className="mypage-section__header">
              <h2>설문 상태</h2>
            </div>
            <div className="mypage-section__content">
              <p className="survey-status">
                {user.surveyCompleted
                  ? "설문을 완료하셨습니다."
                  : "설문을 완료하지 않으셨습니다."}
              </p>
              {!user.surveyCompleted && (
                <button
                  className="button button--survey"
                  onClick={handleOpenSurveyPopup}
                >
                  설문하러 가기
                </button>
              )}
            </div>
          </section>
        </div>
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
