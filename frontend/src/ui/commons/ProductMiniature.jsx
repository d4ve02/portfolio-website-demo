import React from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import "../../css/commons/ProductMiniature.css";
import { backendUrl } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/orders";

const ProductMiniature = ({
    size,
    name,
    id,
    rating,
    status,
    imagePath,
    description,
    price,
}) => {
    const dispatch = useDispatch();

    const getIcon = () => {
        if (status === "loading")
            return <i className="fas fa-spinner product-miniature-loading" />;
        if (status === "failed")
            return <i className="fas fa-times product-miniature-failed" />;
    };

    const getContent = () => (
        <React.Fragment>
            <Link to={"item/" + id}>
                {imagePath && (
                    <img
                        className="miniature-image"
                        src={backendUrl + imagePath}
                        alt={name}
                    />
                )}

                <h3 className="product-miniature-name">{name}</h3>
                <h4 className="product-miniature-price">{price}⨵</h4>

                <Rating rating={rating} />
            </Link>
            <div
                style={{ cursor: "pointer" }}
                onClick={() => dispatch(addToCart(id))}
            >
                <div className="product-buy">
                    +<i className="fas fa-shopping-cart"></i>
                </div>
            </div>
        </React.Fragment>
    );

    return (
        <div
            className="product-miniature"
            style={{
                width: size,
                height: size,
                display: status === "received" ? "block" : "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {status === "received" ? getContent() : getIcon()}
            {status === "failed" && (
                <h3 className="product-miniature-name-error">
                    Something failed
                </h3>
            )}
        </div>
    );
};

export default ProductMiniature;
