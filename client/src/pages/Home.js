// src/pages/Home.js

import React from "react";
import PostList from "../components/posts/PostList";
import SlideBanner from "../components/banner/SlideBanner";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <SlideBanner />
      <h1>최신 분양글</h1>
      {/* hideCompleted를 true로 전달하여 분양완료 글을 숨김 */}
      <PostList hideCompleted={true} />
    </div>
  );
};

export default Home;
