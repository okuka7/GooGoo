// src/components/posts/PostItem.js

import React from "react";
import { Link } from "react-router-dom";
import "./PostItem.css";
import placeholderImage from "../../placeholder.png";

const PostItem = ({ post }) => {
  return (
    <li className="post-item">
      <Link to={`/posts/${post.id}`} className="post-link">
        <img
          src={post.imageUrl || placeholderImage}
          alt={post.title}
          className="post-image"
        />
        <h3 className="post-title">
          {post.title}{" "}
          {post.completed && <span className="completed-label">분양완료</span>}
        </h3>
        <p className="post-animalType">반려동물 종류: {post.animalType}</p>
        <p className="post-author">작성자: {post.authorNickname}</p>
        <p className="post-date">
          작성일:{" "}
          {new Date(post.createdAt)
            .toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\.$/, "")}
        </p>
      </Link>
    </li>
  );
};

export default PostItem;
