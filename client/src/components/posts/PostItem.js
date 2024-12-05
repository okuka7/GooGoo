// src/components/posts/PostItem.js

import React from "react";
import { Link } from "react-router-dom";
import "./PostItem.css";
import placeholderImage from "../../placeholder.png"; // 기본 이미지

const PostItem = ({ post }) => {
  return (
    <li className="post-item">
      <Link to={`/posts/${post.id}`} className="post-link">
        <img
          src={post.imageUrl || placeholderImage}
          alt={post.title}
          className="post-image"
        />
        <h3 className="post-title">{post.title}</h3>
        <p className="post-animalType">반려동물 종류: {post.animalType}</p>
        <p className="post-author">작성자: {post.authorNickname}</p>
        <p className="post-date">
          작성일: {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </Link>
    </li>
  );
};

export default PostItem;
