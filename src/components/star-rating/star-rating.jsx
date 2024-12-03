import { useState } from "react";
import { FaStar } from 'react-icons/fa';
import './style.css';

export default function StarRating({ numberOfStars = 5, rating, onRatingChange }) {
    const [hover, setHover] = useState(0);

    function handleClick(getCurrentIndex) {
        onRatingChange(getCurrentIndex);
    }

    function handleMouseEnter(getCurrentIndex) {
        setHover(getCurrentIndex);
    }

    function handleMouseLeave() {
        setHover(rating);
    }

    return (
        <div className="star-rating">
            {[...Array(numberOfStars)].map((_, index) => {
                index += 1;
                return (
                    <FaStar
                        key={index}
                        className={index <= (hover || rating) ? "active" : "inactive"}
                        onClick={() => handleClick(index)}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                        size={25}
                    />
                );
            })}
        </div>
    );
}
