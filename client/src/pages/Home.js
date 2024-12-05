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
      <PostList />
    </div>
  );
};

export default Home;
