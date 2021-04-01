import React from "react";
import "../../css/commons/Rating.css";

const Rating = ({ rating, filter, transparent, className }) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        if (rating - i >= 1 || rating - Math.floor(rating) > 0.8) {
            stars.push(<i key={i} className="fas fa-star"></i>);
        } else if (rating - i <= 0 || rating - Math.floor(rating) < 0.2) {
            stars.push(<i key={i} className="far fa-star"></i>);
        } else {
            stars.push(<i key={i} className="fas fa-star-half-alt"></i>);
        }
    }

    const style = {
        color: transparent
            ? "var(--very-transparent-light-color)"
            : "var(--transparent-light-color)",
        position: "relative",
        margin: "0px",
        padding: "0px",
        borderRadius: "0px",
    };

    return (
        <div
            className={`${filter ? "ratingForFilter" : "rating"} ${className}`}
            style={filter && style}
        >
            {stars}
        </div>
    );
};

export default Rating;
