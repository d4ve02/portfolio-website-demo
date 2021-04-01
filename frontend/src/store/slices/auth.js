import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../middleware/apiActions";
import jwt from "jsonwebtoken";

const auth = createSlice({
    name: "auth",
    initialState: {
        userData: {
            _id: "",
            username: "",
            email: "",
            address: "",
            balance: 0,
            isAdmin: "",
        },
        status: "idle",
        jwt: "",
        updateStatus: "idle",
    },
    reducers: {
        signUpRequestSent: (auth, action) => {},
        signUpRequestSuccessful: (auth, action) => {
            auth.userData = action.payload.data;
        },
        signUpRequestFailed: (auth, action) => {},

        loginRequestSent: (auth, action) => {},
        loginRequestSuccessful: (auth, action) => {},
        loginRequestFailed: (auth, action) => {},

        loadedAuthenticationToken: (auth, action) => {
            auth.jwt = action.payload;
            const jwtPayload = jwt.decode(action.payload);
            auth.userData._id = jwtPayload._id;
            auth.userData.isAdmin = jwtPayload.isAdmin;
        },
        deleteAuthenticationToken: (auth, action) => {
            auth.jwt = "";
            auth.userData = {
                _id: "",
                username: "",
                email: "",
                address: "",
                balance: 0,
                isAdmin: "",
            };
        },
        loggedOut: (auth, action) => {},

        userDataRequestSent: () => {},
        userDataRequestSuccessful: (auth, action) => {
            auth.userData.username = action.payload.data.username;
            auth.userData.email = action.payload.data.email;
            auth.userData.address = action.payload.data.address;
            auth.userData.balance = action.payload.data.balance;
        },
        userDataRequestFailed: (auth, action) => {},

        userUpdateRequestSent: (auth, action) => {
            auth.updateStatus = "loading";
        },
        userUpdateRequestSuccessful: (auth, action) => {
            auth.userData = action.payload.data;
            auth.updateStatus = "success";
        },
        userUpdateRequestFailed: (auth, action) => {
            auth.updateStatus = "failed";
        },

        userDeleteRequestSent: (auth, action) => {},
        userDeleteRequestSuccessful: (auth, action) => {},
        userDeleteRequestFailed: (auth, action) => {},

        resetStatus: (auth, action) => {
            auth.updateStatus = "idle";
        },
    },
});

export const {
    signUpRequestSent,
    signUpRequestSuccessful,
    signUpRequestFailed,
    loginRequestSent,
    loginRequestSuccessful,
    loginRequestFailed,
    loggedOut,
    loadedAuthenticationToken,
    deleteAuthenticationToken,
    userDataRequestSent,
    userDataRequestSuccessful,
    userDataRequestFailed,
    userUpdateRequestSent,
    userUpdateRequestSuccessful,
    userUpdateRequestFailed,
    userDeleteRequestSent,
    userDeleteRequestSuccessful,
    userDeleteRequestFailed,
    resetStatus,
} = auth.actions;
export default auth.reducer;

const usersUrl = "/users";
const authUrl = "/auth";

export const signUp = (data) => {
    return apiCallBegan({
        url: usersUrl,
        method: "post",
        data: data,
        onStart: signUpRequestSent.type,
        onSuccess: signUpRequestSuccessful.type,
        onError: signUpRequestFailed.type,
    });
};

export const login = (data) => {
    return apiCallBegan({
        url: authUrl,
        method: "post",
        data: data,
        onStart: loginRequestSent.type,
        onSuccess: loginRequestSuccessful.type,
        onError: loginRequestFailed.type,
    });
};

export const logout = () => {
    window.localStorage.removeItem("x-auth-token");

    return {
        type: loggedOut.type,
    };
};

export const getUserData = () => {
    return apiCallBegan({
        url: usersUrl,
        method: "get",
        onStart: userDataRequestSent.type,
        onSuccess: userDataRequestSuccessful.type,
        onError: userDataRequestFailed.type,
        authorized: true,
    });
};

export const updateProfile = (data) => {
    return apiCallBegan({
        url: usersUrl + "/update",
        method: "post",
        data: data,
        onStart: userUpdateRequestSent.type,
        onSuccess: userUpdateRequestSuccessful.type,
        onError: userUpdateRequestFailed.type,
        authorized: true,
    });
};

export const deleteProfile = () => {
    return apiCallBegan({
        url: usersUrl + "/my-account",
        method: "delete",
        onStart: userUpdateRequestSent.type,
        onSuccess: userUpdateRequestSuccessful.type,
        onError: userUpdateRequestFailed.type,
        authorized: true,
    });
};

export const getAuth = (state) => state.auth;
export const jwtSelector = (state) => state.auth.jwt;
export const userDataSelector = (state) => state.auth.userData;
export const userUpdateStatusSelector = (state) => state.auth.updateStatus;
export const balanceSelector = (state) => state.auth.userData.balance;
