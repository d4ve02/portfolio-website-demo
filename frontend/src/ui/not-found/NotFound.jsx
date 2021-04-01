import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import "../../css/not-found/NotFound.css";
import {
    notFoundWallpaper,
    setNewWallpaper,
} from "../../store/slices/wallpaper";

const NotFound = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setNewWallpaper(notFoundWallpaper));
    }, [dispatch]);

    return (
        <div className="not-found">
            <h1 className="top-header-not-found">404 - Not Found...</h1>
            <article className="explanation-not-found">
                The page you were looking for seems to be missing, maybe wrong
                URL?
            </article>
            <i className="fa fa-link"></i>
        </div>
    );
};

export default NotFound;
