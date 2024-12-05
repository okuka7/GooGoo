// src/components/posts/PostList.js

import React from "react";
import PostItem from "./PostItem";
import "./PostList.css";

const PostList = ({ posts = [] }) => {
  if (posts.length === 0) {
    return <p>게시글이 없습니다.</p>;
  }

  return (
    <div className="post-list-container">
      <ul className="post-list">
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </ul>
    </div>
  );
};

export default PostList;
