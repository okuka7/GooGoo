// src/components/user/UserPosts.js

import React from "react";
import { Link } from "react-router-dom";
import "./UserPosts.css";

const UserPosts = ({ posts }) => {
  if (posts.length === 0) return <p>작성한 게시물이 없습니다.</p>;

  return (
    <ul className="user-posts-list">
      {posts.map((post) => (
        <li key={post.id} className="user-post-item">
          <Link to={`/posts/${post.id}`}>
            <h4>{post.title}</h4>
            <p>반려동물 종류: {post.animalType}</p>
            <p>작성일: {new Date(post.createdAt).toLocaleDateString()}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default UserPosts;
