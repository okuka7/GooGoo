// src/components/banner/SlideBanner.js

import React, { useState } from "react";
import "./SlideBanner.css";

const images = [
  "https://via.placeholder.com/800x300?text=Slide+1",
  "https://via.placeholder.com/800x300?text=Slide+2",
  "https://via.placeholder.com/800x300?text=Slide+3",
];

const SlideBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="slide-banner">
      <button className="prev-button" onClick={handlePrev}>
        &lt;
      </button>
      <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} />
      <button className="next-button" onClick={handleNext}>
        &gt;
      </button>
    </div>
  );
};

export default SlideBanner;
