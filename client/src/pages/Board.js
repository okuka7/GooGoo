// src/components/Board.js

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../store/postSlice";
import { Link } from "react-router-dom";
import "./Board.css";
import placeholderImage from "../placeholder.png";
import ApplicationList from "../components/applications/ApplicationList"; // 추가

const Board = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="board-container">
      <h1>분양 게시판</h1>
      {isAuthenticated && (
        <Link to="/posts/new" className="create-post-button">
          게시물 작성
        </Link>
      )}
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post-item">
            <Link to={`/posts/${post.id}`} className="post-link">
              <div className="post-image-container">
                <img
                  src={post.imageUrl || placeholderImage}
                  alt={post.title}
                  className="post-image"
                />
              </div>
              <div className="post-content">
                <h3 className="post-title">
                  {post.title}{" "}
                  {post.completed && (
                    <span className="completed-label">분양완료</span>
                  )}
                </h3>
                <p className="post-animalType">
                  반려동물 종류: {post.animalType}
                </p>
                <p className="post-author">작성자: {post.authorNickname}</p>
                <p className="post-date">
                  작성일:{" "}
                  {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Board;
