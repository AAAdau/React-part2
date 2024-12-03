import React, { useState, useEffect } from "react";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { getImages } from "../api";
import star from "../images/stars_rating_black.svg";
import "./Home.css";

export default function Home() {
  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getImages().then((data) => setImages(data));
  }, []);

  function handleToPrev() {
    setCurrentSlide(currentSlide === 0 ? images.length - 1 : currentSlide - 1);
  }

  function handleToNext() {
    setCurrentSlide(currentSlide === images.length - 1 ? 0 : currentSlide + 1);
  }

  return (
    <div className="page1">
      <img className="star" src={star} alt="Stars" />
      <h2>Over 20 million customers</h2>

      <div className="container">
        <BsArrowLeftCircleFill onClick={handleToPrev} className="arrow arrow-left" />
        {images && images.length ? (
          images.map((imageItem, index) => (
            <div
              key={imageItem.id}
              className={currentSlide === index ? "current-image" : "hide-current-image"}
            >
              <img
                src={imageItem.url}
                alt="Perfume"
                className="carousel-image"
                style={{
                  width: "100vw",
                  height: "500px",
                  objectFit: "cover",
                }}
              />
              <div className="overlay">
                <h1 className="title">The best smell</h1>
                <button
                  className="shop-button"
                  onClick={() => navigate("/shop")}
                >
                  Shop Now
                </button>
              </div>
            </div>
          ))
        ) : null}
        <BsArrowRightCircleFill onClick={handleToNext} className="arrow arrow-right" />
      </div>

      <span className="circle-indicators">
        {images && images.length
          ? images.map((_, index) => (
              <button
                key={index}
                className={currentSlide === index ? "current-indicator" : "inactive-indicator"}
                onClick={() => setCurrentSlide(index)}
              />
            ))
          : null}
      </span>
    </div>
  );
}
