import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    path: "",
};

const wallpaper = createSlice({
    name: "wallpaper",
    initialState,
    reducers: {
        setNewWallpaper: (wallpaper, action) => {
            wallpaper.path = action.payload;
        },
    },
});

export const { setNewWallpaper } = wallpaper.actions;
export default wallpaper.reducer;

export const landingPageWallpaper = "landingPageWallpaper.jpg";
export const profilePageWallpaper = "profilePageWallpaper.jpg";
export const notFoundWallpaper = "notFoundWallpaper.jpg";
export const authenticationWallpaper = "authenticationWallpaper.jpg";
export const marketplaceWallpaper = "productWallpaper.jpg";
export const productWallpaper = "productWallpaper.jpg";
export const dashboardWallpaper = "dashboardWallpaper.jpg";

export const wallpaperSelector = (state) => state.wallpaper;
