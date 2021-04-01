import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    message:
        "This is a student showcase portfolio website, not a real service. If you choose to create an account, do so with fake credentials and don't put any sensitive information in any form. User accounts and their data are deleted automatically 15 minutes after they're created.",
    button: "Okay, got it!",
    accepted: false,
};

const toast = createSlice({
    name: "toast",
    initialState,
    reducers: {
        toastAccepted: (toast, action) => {
            toast.accepted = true;
        },
        newToast: (toast, action) => {
            toast.message = action.payload.message;
            toast.button = action.payload.button;
            toast.accepted = false;
        },
    },
});

export const { toastAccepted, newToast } = toast.actions;
export default toast.reducer;

export const toastSelector = (state) => state.toast;
