import React from "react";
import "../../css/marketplace/PriceFilter.css";

const PriceFilter = ({ value, onFilterChange, marketplaceSubmitHandler }) => {
    const onChange = (index, update) => {
        const newData = [...value];
        newData[index] = update;

        if (newData[0] > newData[1]) {
            newData[index === 0 ? 1 : 0] = newData[index];
        }

        onFilterChange(newData);
    };

    return (
        <div className="priceFilter">
            <span className="priceLabel">Min: </span>
            <input
                className="priceSlide"
                type="range"
                value={value[0] / 10}
                onChange={(e) => onChange(0, e.currentTarget.value * 10)}
                onMouseUp={() => marketplaceSubmitHandler()}
                onTouchEnd={() => marketplaceSubmitHandler()}
            />
            <span className="priceValue">{value[0]}⨵</span>
            <span className="priceLabel">Max: </span>
            <input
                className="priceSlide"
                type="range"
                value={value[1] / 10}
                onChange={(e) => onChange(1, e.currentTarget.value * 10)}
                onMouseUp={() => marketplaceSubmitHandler()}
                onTouchEnd={() => marketplaceSubmitHandler()}
            />
            <span className="priceValue">{value[1]}⨵</span>
        </div>
    );
};

export default PriceFilter;
