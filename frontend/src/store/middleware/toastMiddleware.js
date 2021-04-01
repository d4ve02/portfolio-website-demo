import {
    addToCartRequestFailed,
    addToCartRequestSuccessful,
    cancelOrderRequestFailed,
    completeOrderRequestFailed,
    placeOrderRequestFailed,
    removeFromCartRequestFailed,
} from "../slices/orders";
import { newToast } from "../slices/toast";

const toastMiddleware = ({ dispatch }) => (next) => (action) => {
    if (action.type === addToCartRequestSuccessful.type) {
        dispatch(newToast({ message: "Item added to cart!", button: "Ok" }));
    } else if (action.type === addToCartRequestFailed.type) {
        dispatch(
            newToast({
                message: `Couldn't add item to cart: ${action.payload}`,
                button: "Okay :(",
            })
        );
    } else if (action.type === removeFromCartRequestFailed.type) {
        dispatch(
            newToast({
                message: `Couldn't remove item from cart: ${action.payload}`,
                button: "Okay :(",
            })
        );
    } else if (action.type === placeOrderRequestFailed.type) {
        dispatch(
            newToast({
                message: `Couldn't place order: ${action.payload}`,
                button: "Okay :(",
            })
        );
    } else if (action.type === completeOrderRequestFailed.type) {
        dispatch(
            newToast({
                message: `Couldn't complete order: ${action.payload}`,
                button: "Okay :(",
            })
        );
    } else if (action.type === cancelOrderRequestFailed.type) {
        dispatch(
            newToast({
                message: `Couldn't cancel order: ${action.payload}`,
                button: "Okay :(",
            })
        );
    }

    next(action);
};

export default toastMiddleware;
