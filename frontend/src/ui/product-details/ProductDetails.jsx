import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    productSelector,
    requestProduct,
    resetProductData,
} from "../../store/slices/items";
import ProductModify from "./ProductModify";
import {
    productWallpaper,
    setNewWallpaper,
} from "../../store/slices/wallpaper";
import { resetProductForm } from "../../store/slices/forms";
import { userDataSelector } from "../../store/slices/auth";
import { backendUrl } from "../../utils/constants";
import "../../css/product-details/ProductDetails.css";
import Rating from "../commons/Rating";
import { addToCart } from "../../store/slices/orders";

const ProductDetails = (props) => {
    const dispatch = useDispatch();
    const product = useSelector(productSelector);
    const user = useSelector(userDataSelector);
    const imageRef = useRef(null);

    useEffect(() => {
        dispatch(setNewWallpaper(productWallpaper));
    }, [dispatch]);

    useEffect(() => {
        dispatch(requestProduct(props.match.params.id));
    }, [dispatch, props.match.params.id]);

    useEffect(() => {
        return () => {
            dispatch(resetProductData());
            dispatch(resetProductForm());
        };
    }, [dispatch]);

    const {
        name,
        description,
        rating,
        price,
        stock,
        imagePath,
        sellerId,
    } = product.data;

    if (user._id.toString() === sellerId) {
        return <ProductModify _id={props.match.params.id} />;
    }

    return (
        <div className="productDetailsMain">
            {imagePath ? (
                <img
                    className="productImageMain"
                    src={backendUrl + imagePath}
                    alt="product representation"
                    ref={imageRef}
                />
            ) : (
                <div className="productImageMain">
                    <i className="fas fa-exclamation-circle imageErrorCircle" />
                </div>
            )}
            <div className="productDetailsContainer">
                <div className="topSectionDetails">
                    <h1 className="productName">{name}</h1>
                    <div className="productInformation">
                        <Rating rating={rating} className="productRating" />•
                        <span className="productPrice">{price}</span>
                    </div>
                </div>

                <div className="middleSectionDetails">
                    <p className="productDescription">{description}</p>
                    <p className="productStock">{stock}</p>
                </div>

                <button
                    className="productBuy"
                    onClick={() => dispatch(addToCart(props.match.params.id))}
                >
                    <i className="fas fa-shopping-cart"></i>
                    {`Add to cart`}
                </button>
            </div>
        </div>
    );
};

export default ProductDetails;
