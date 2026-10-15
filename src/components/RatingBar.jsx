import { useState } from 'react';
import Star from "../components/Star.jsx";

export function  RatingBar ({ maxRating = 5, onRatingChange }) {
    const [rating, setRating] = useState(0);
    const [color, setColor] = useState('grey');

    const handleClick = (starIndex) => {
        const newRating = starIndex + 1;
        setRating(newRating);
        onRatingChange(newRating); // Notify parent component of rating change
    };

    const renderStars = () => {
        var colors= 'grey_red_#ffbf00_orange_lightGreen_green'.split('_');
        const stars = [];
        for (let i = 0; i < maxRating; i++) {
            stars.push(
                <Star
                    key={i}
                    filled={i < rating}
                    half={i == Math.floor(rating) && rating % 1 !== 0}
                    color={i < rating ? colors[rating] : colors[0] }
                    onClick={() => handleClick(i)}
                />
            );
        }
        return stars;
    };

    return <div style={{display: 'flex'}}>{renderStars()}</div>;
};

export default RatingBar;