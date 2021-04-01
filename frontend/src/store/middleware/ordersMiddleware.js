import { getUserData } from "../slices/auth";
import {
    addToCartRequestSuccessful,
    cancelOrderRequestSuccessful,
    cleanCart,
    cleanOrdered,
    cleanSold,
    completeOrderRequestSuccessful,
    placeOrderRequestSuccessful,
    removeFromCartRequestSuccessful,
} from "../slices/orders";

const ordersMiddleware = ({ dispatch }) => (next) => (action) => {
    if (
        action.type === removeFromCartRequestSuccessful.type ||
        action.type === addToCartRequestSuccessful.type
    ) {
        dispatch(cleanCart());
    } else if (action.type === placeOrderRequestSuccessful.type) {
        dispatch(cleanCart());
        dispatch(cleanOrdered());
        dispatch(getUserData());
    } else if (action.type === completeOrderRequestSuccessful.type) {
        dispatch(cleanOrdered());
    } else if (action.type === cancelOrderRequestSuccessful.type) {
        dispatch(cleanOrdered());
        dispatch(cleanSold());
        dispatch(getUserData());
    }

    next(action);
};

export default ordersMiddleware;
