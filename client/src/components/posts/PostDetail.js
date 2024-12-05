import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, deletePost } from "../../store/postSlice";
import { applyForPost } from "../../store/applicationSlice"; // 필요 시 유지
import SurveyPopup from "../survey/SurveyPopup"; // SurveyPopup 임포트
import "./PostDetail.css";

const PostDetail = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { posts, loading, error } = useSelector((state) => state.posts);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [surveyModalOpen, setSurveyModalOpen] = useState(false); // 설문 모달 상태

  // 현재 게시물 찾기
  const post = posts.find((p) => p.id === parseInt(postId));

  // 게시물 작성자인지 여부 확인
  const isAuthor = user && post && post.authorUsername === user.username;

  useEffect(() => {
    if (!post) {
      // 게시물이 로드되지 않았다면 게시물 목록을 가져옵니다.
      dispatch(fetchPosts());
    }
    // 신청자 목록 관련 dispatch 제거
  }, [dispatch, post]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!post) return <div>게시물을 찾을 수 없습니다.</div>;

  // 게시물 삭제 핸들러
  const handleDelete = () => {
    if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      dispatch(deletePost(postId))
        .unwrap()
        .then(() => navigate("/board"))
        .catch((err) => alert(err));
    }
  };

  // 분양 신청 핸들러
  const handleApply = () => {
    if (!user?.surveyCompleted) {
      alert("설문지를 먼저 작성해주세요.");
      navigate("/survey");
      return;
    }
    dispatch(applyForPost(postId))
      .unwrap()
      .then(() => alert("분양 신청이 완료되었습니다."))
      .catch((err) => alert(err));
  };

  // 설문 보기 핸들러 (필요 시 유지)
  const handleViewSurvey = () => {
    setSurveyModalOpen(true);
  };

  // 설문 모달 닫기 핸들러
  const closeSurveyModal = () => {
    setSurveyModalOpen(false);
  };

  return (
    <div className="post-detail-container">
      <h2>{post.title}</h2>
      <p>작성자: {post.authorNickname || post.authorUsername}</p>
      <p>작성일: {new Date(post.createdAt).toLocaleDateString()}</p>
      <p>반려동물 종류: {post.animalType}</p>
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="post-detail-image"
        />
      )}
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* 작성자인 경우 수정 및 삭제 버튼 표시 */}
      {isAuthor && (
        <div className="post-actions">
          <button
            className="edit-button"
            onClick={() => navigate(`/posts/${post.id}/edit`)}
          >
            수정
          </button>
          <button className="delete-button" onClick={handleDelete}>
            삭제
          </button>
        </div>
      )}

      {/* 작성자가 아닌 경우 분양 신청 버튼 표시 */}
      {isAuthenticated && !isAuthor && (
        <button className="apply-button" onClick={handleApply}>
          분양 신청하기
        </button>
      )}

      {/* 설문 팝업 */}
      {surveyModalOpen && (
        <SurveyPopup
          isOpen={surveyModalOpen}
          onClose={closeSurveyModal}
          // applicantId prop 제거 또는 필요 시 수정
        />
      )}
    </div>
  );
};

export default PostDetail;
