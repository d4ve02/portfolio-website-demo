import React from "react";
import "../../css/commons/Paginate.css";

const Paginate = ({ page, setPage, itemsPerPage, count, shouldScroll }) => {
    const dots = [];

    if (!count) {
        return null;
    }

    for (let i = 0; i < count / itemsPerPage; i++) {
        dots.push(
            <div
                className={`dot ${i === page && "active"}`}
                key={i}
                onClick={() => {
                    setPage(i);
                    if (shouldScroll) {
                        window.scrollTo(0, 0);
                    }
                }}
            ></div>
        );
    }

    if (dots.length === 1) {
        return null;
    }

    return <div className="paginate">{dots}</div>;
};

export default Paginate;
