import React from "react";
import Rating from "../commons/Rating";
import "../../css/marketplace/RatingFilter.css";

const RatingLine = ({ number, onFilterChange, checked, all }) => {
    if (all) {
        return (
            <div className={`ratingLine ${checked ? "" : "ratingUnchecked"}`}>
                <span>All ratings</span>
                <div style={{ flexGrow: 1 }} />
                <input
                    className="ratingCheck"
                    type="checkbox"
                    checked={checked}
                    onChange={() => onFilterChange(number)}
                />
            </div>
        );
    }
    return (
        <div className={`ratingLine ${checked ? "" : "ratingUnchecked"}`}>
            <span>At least</span>
            <Rating rating={number} filter transparent={!checked} />
            <input
                className="ratingCheck"
                type="checkbox"
                checked={checked}
                onChange={() => onFilterChange(number)}
            />
        </div>
    );
};

const RatingFilter = ({ onFilterChange, value }) => {
    const ratings = [];

    for (let i = 4; i >= 0; i--) {
        if (i === 0) {
            ratings.push(
                <RatingLine
                    key={i}
                    number={i}
                    checked={i >= value}
                    onFilterChange={onFilterChange}
                    all
                />
            );
        } else {
            ratings.push(
                <RatingLine
                    key={i}
                    number={i}
                    checked={i >= value}
                    onFilterChange={onFilterChange}
                />
            );
        }
    }

    return <div className="ratingFilter">{ratings}</div>;
};

export default RatingFilter;
