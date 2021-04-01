import React from "react";
import ProductMiniature from "../commons/ProductMiniature";
import "../../css/landing-page/ProductExpo.css";

const ProductExpo = ({ text, items, status }) => {
    const placeholderProducts = () => {
        const products = [];
        for (let i = 0; i < 6; i++) {
            products.push(<ProductMiniature key={i} status={status} />);
        }
        return products;
    };

    const realProducts = () =>
        items.map((p) => (
            <ProductMiniature
                key={p._id}
                name={p.name}
                id={p._id}
                rating={p.rating}
                status={status}
                imagePath={p.imagePath}
                description={p.description}
                price={p.price}
            />
        ));

    return (
        <div className="product-expo">
            <h2 className="product-expo-title">{text}</h2>
            <div className="product-expo-content">
                {items.length === 0 ? placeholderProducts() : realProducts()}
            </div>
        </div>
    );
};

export default ProductExpo;
