// src/components/posts/PostList.js

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "../../store/postSlice";
import PostItem from "./PostItem";
import "./PostList.css";

const PostList = ({ hideCompleted = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  console.log("Posts in PostList:", posts);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!posts || posts.length === 0) return <p>게시글이 없습니다.</p>;

  // hideCompleted가 true일 경우, completed가 false인 게시글만 필터링
  const filteredPosts = hideCompleted
    ? posts.filter((post) => !post.completed)
    : posts;

  if (filteredPosts.length === 0) return <p>게시글이 없습니다.</p>;

  return (
    <div className="post-list-container">
      <ul className="post-list">
        {filteredPosts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </ul>
    </div>
  );
};

export default PostList;
