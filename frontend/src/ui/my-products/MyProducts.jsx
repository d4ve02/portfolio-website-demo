import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    changedPage,
    itemsSelector,
    requestItems,
    resetSearchedItems,
} from "../../store/slices/items";
import { userDataSelector } from "../../store/slices/auth";
import {
    marketplaceWallpaper,
    setNewWallpaper,
} from "../../store/slices/wallpaper";
import Paginate from "../commons/Paginate";
import Products from "../commons/Products";
import "../../css/my-products/MyProducts.css";
import { redirectToPage } from "../../store/slices/redirect";

const MyProducts = () => {
    const dispatch = useDispatch();
    const items = useSelector(itemsSelector);
    const user = useSelector(userDataSelector);

    useEffect(() => {
        dispatch(setNewWallpaper(marketplaceWallpaper));
    }, [dispatch]);

    useEffect(() => {
        if (user._id) {
            dispatch(requestItems({ sellerId: user._id.toString() }), []);
            dispatch(changedPage(0));
        }
    }, [user._id, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(resetSearchedItems());
        };
    }, [dispatch]);

    return (
        <div className="myProducts">
            <h1 className="myProductsTitle">My Products</h1>

            <Products itemsPerPage={24} />
            <Paginate
                page={items.page}
                itemsPerPage={24}
                count={items.list.length}
                setPage={(n) => dispatch(changedPage(n))}
                shouldScroll={true}
            />
            <button
                className="addNewProduct"
                onClick={() => dispatch(redirectToPage({ path: "new-item" }))}
            >
                Add Product
            </button>
        </div>
    );
};

export default MyProducts;
