import React, { useEffect } from "react";
import ProductExpo from "./ProductExpo";
import {
    expoItemsSelector,
    requestHottestExpoItems,
    requestRecommendedExpoItems,
} from "../../store/slices/items";

import "../../css/landing-page/LandingPage.css";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "../commons/SearchBar";
import {
    landingPageWallpaper,
    setNewWallpaper,
} from "../../store/slices/wallpaper";

const LandingPage = () => {
    const dispatch = useDispatch();
    const expoItems = useSelector(expoItemsSelector);

    useEffect(() => {
        dispatch(setNewWallpaper(landingPageWallpaper));
    }, [dispatch]);

    useEffect(() => {
        dispatch(requestHottestExpoItems());
        dispatch(requestRecommendedExpoItems());
    }, [dispatch]);

    return (
        <div className="landing-page">
            <SearchBar shouldRedirect={true} />
            <ProductExpo
                text="Hottest buys of the week"
                items={expoItems.hottest}
                status={expoItems.status}
            />
            <ProductExpo
                text="Products you might like"
                items={expoItems.recommended}
                status={expoItems.status}
            />
        </div>
    );
};

export default LandingPage;
