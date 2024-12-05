import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../store/postSlice";
import PostList from "../components/posts/PostList";
import { Link } from "react-router-dom";
import "./Board.css";

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
      <PostList posts={posts} />
    </div>
  );
};

export default Board;
