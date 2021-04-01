import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../css/marketplace/Marketplace.css";
import {
    changedPage,
    itemsSelector,
    requestItems,
    resetSearchedItems,
} from "../../store/slices/items";
import {
    marketplaceWallpaper,
    setNewWallpaper,
} from "../../store/slices/wallpaper";
import Paginate from "../commons/Paginate";
import SearchBar from "../commons/SearchBar";
import PriceFilter from "./PriceFilter";
import Products from "../commons/Products";
import RatingFilter from "./RatingFilter";

const Marketplace = () => {
    const dispatch = useDispatch();
    const items = useSelector(itemsSelector);
    const [formData, setFormData] = useState({
        search: "",
        rating: 0,
        price: [0, 1000],
    });

    useEffect(() => {
        dispatch(setNewWallpaper(marketplaceWallpaper));
    }, [dispatch]);

    useEffect(() => {
        if (items.list.length === 0 && items.status !== "loading") {
            dispatch(requestItems({}));
        }
    }, [dispatch, items.list.length, items.status]);

    useEffect(() => {
        return () => {
            dispatch(resetSearchedItems());
        };
    }, [dispatch]);

    const onFilterChange = (property) => (value) => {
        const newFormData = { ...formData };
        newFormData[property] = value;
        setFormData(newFormData);
        if (property === "rating") {
            doSearch(newFormData);
        }
    };

    const doSearch = useCallback(
        (updatedFormData) => {
            const { search, rating, price } = updatedFormData
                ? updatedFormData
                : formData;
            const priceMin = price[0];
            const priceMax = price[1];
            dispatch(requestItems({ search, rating, priceMin, priceMax }));
            dispatch(changedPage(0));
        },
        [formData, dispatch]
    );

    return (
        <div className="marketplace">
            <div className="marketplaceSidebar">
                <h2 className="filterTitle">Rating</h2>
                <RatingFilter
                    value={formData.rating}
                    onFilterChange={onFilterChange("rating")}
                />
                <h2 className="filterTitle">Price</h2>
                <PriceFilter
                    value={formData.price}
                    onFilterChange={onFilterChange("price")}
                    marketplaceSubmitHandler={doSearch}
                />
            </div>
            <div className="searchResults">
                <SearchBar
                    value={formData.search}
                    onFilterChange={onFilterChange("search")}
                    marketplaceSubmitHandler={doSearch}
                />
                <Products itemsPerPage={24} doSearch={doSearch} />
                <Paginate
                    page={items.page}
                    itemsPerPage={24}
                    count={items.list.length}
                    setPage={(n) => dispatch(changedPage(n))}
                    shouldScroll={true}
                />
            </div>
        </div>
    );
};

export default Marketplace;
