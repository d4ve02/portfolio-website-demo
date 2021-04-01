import { combineReducers } from "redux";
import authReducer, { loggedOut } from "../slices/auth";
import formsReducer from "../slices/forms";
import redirectReducer from "../slices/redirect";
import wallpaperReducer from "../slices/wallpaper";
import toastReducer from "../slices/toast";
import itemsReducer from "../slices/items";
import ordersReducer from "../slices/orders";

const appReducer = combineReducers({
    auth: authReducer,
    forms: formsReducer,
    redirect: redirectReducer,
    wallpaper: wallpaperReducer,
    toast: toastReducer,
    items: itemsReducer,
    orders: ordersReducer,
});

const rootReducer = (state, action) => {
    if (action.type === loggedOut.type) {
        state = undefined;
    }

    return appReducer(state, action);
};

export default rootReducer;
