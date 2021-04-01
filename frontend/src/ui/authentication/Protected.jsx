import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import "../../css/authentication/ProtectedComponent.css";
import {
    landingPageWallpaper,
    setNewWallpaper,
} from "../../store/slices/wallpaper";

const Protected = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setNewWallpaper(landingPageWallpaper));
    }, [dispatch]);

    return (
        <div className="protected">
            <h1>You must be logged in to use this webpage!</h1>
        </div>
    );
};

export default Protected;
