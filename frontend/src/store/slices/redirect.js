import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    path: null,
};

const redirect = createSlice({
    name: "redirect",
    initialState,
    reducers: {
        redirectToPage: (redirect, action) => {
            redirect.path = action.payload.path;
        },

        redirected: (redirect, action) => {
            redirect.path = null;
        },
    },
});

export const { redirectToPage, redirected } = redirect.actions;
export default redirect.reducer;

export const redirectSelector = (state) => state.redirect.path;
