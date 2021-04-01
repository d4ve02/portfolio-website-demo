import { configureStore } from "@reduxjs/toolkit";
import api from "./middleware/api";
import auth from "./middleware/authMiddleware";
import redirectMiddleware from "./middleware/redirectMiddleware";
import formValidation from "./middleware/formValidation";
import toastMiddleware from "./middleware/toastMiddleware";
import mainReducer from "./reducers/mainReducer";
import ordersMiddleware from "./middleware/ordersMiddleware";

const setupStore = () =>
    configureStore({
        reducer: mainReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(formValidation)
                .concat(auth)
                .concat(redirectMiddleware)
                .concat(api)
                .concat(toastMiddleware)
                .concat(ordersMiddleware),
    });

export default setupStore;
