import React from "react";
import { itemsSelector } from "../../store/slices/items";
import ProductMiniature from "./ProductMiniature";
import "../../css/commons/Products.css";
import { useSelector } from "react-redux";

const Products = ({ itemsPerPage }) => {
    const items = useSelector(itemsSelector);

    const page = items.page;

    const paginateItems = () => {
        let toRender = [];
        let start = page * itemsPerPage;

        if (start >= items.list.length) {
            return null;
        }

        for (let i = 0; i < itemsPerPage; i++) {
            if (start + i < items.list.length) {
                toRender.push(items.list[start + i]);
            } else {
                break;
            }
        }

        return toRender.map((p) => {
            return (
                <ProductMiniature
                    key={p._id}
                    name={p.name}
                    id={p._id}
                    rating={p.rating}
                    status={items.status}
                    imagePath={p.imagePath}
                    description={p.description}
                    price={p.price}
                />
            );
        });
    };

    return <div className="products">{paginateItems()}</div>;
};

export default Products;
