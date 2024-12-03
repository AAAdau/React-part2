import React from "react";
import { useState, useEffect } from "react";
import "./Home.css";
import star from "../images/stars_rating_black.svg";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from 'react-icons/bs'
import { getImages } from '../api';
export default function Home() {
    const [images, setImages] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        getImages().then(data => setImages(data));
    }, []);

    function handleToPrev() {
        setCurrentSlide(currentSlide === 0 ? images.length - 1 : currentSlide - 1)
        console.log(currentSlide)
    }

    function handleToNext() {
        setCurrentSlide(currentSlide === images.length - 1 ? 0 : currentSlide + 1)
        console.log(currentSlide)
    }

    console.log(images)


    return (
        <div className="page1">
            <img className="star" src={star} />
            <h2>over 20 million customers</h2>
            <div className="container">
                <BsArrowLeftCircleFill
                    onClick={handleToPrev}
                    className="arrow arrow-left"
                />
                {
                    images && images.length ?
                        images.map((imageItem, index) => (
                            < img
                                key={imageItem.id}
                                src={imageItem.url}
                                className={currentSlide === index
                                    ? "current-image"
                                    : "current-image hide-current-image"}
                            />
                        ))
                        : null
                }
                <BsArrowRightCircleFill
                    onClick={handleToNext}
                    className="arrow arrow-right"
                />
                <span className="circle-indicators">
                    {
                        images && images.length ?
                            images.map((_, index) => (
                                <button
                                    key={index}
                                    className={
                                        currentSlide === index
                                            ? "current-indicator"
                                            : "current-indicator inactive-indicator"
                                    }
                                    onClick={() => setCurrentSlide(index)}
                                >
                                </button>
                            ))
                            : null
                    }
                </span>
            </div>
        </div>
    )
}