import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "../store/authSlice";
import { fetchUserPosts } from "../store/postSlice";
import UserInfo from "../components/user/UserInfo";
import { useNavigate } from "react-router-dom";
import ApplicantList from "../components/applications/ApplicationList"; // ✅ 추가된 부분
import "./MyPage.css";

const MyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
              <ApplicantList postId={post.id} /> {/* ✅ 추가된 부분 */}
            </div>
          ))}
          <h2>설문 상태</h2>
          <p>
            {user.surveyCompleted
              ? "설문을 완료하셨습니다."
              : "설문을 완료하지 않으셨습니다."}
          </p>
        </>
      ) : (
        <p>사용자 정보를 불러오는 중입니다.</p>
      )}
    </div>
  );
};

export default MyPage;
