import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../middleware/apiActions";

const initialState = {
    cart: {
        data: [],
        status: "clean",
        page: 0,
    },
    ordered: {
        data: [],
        status: "clean",
        page: 0,
    },
    sold: {
        data: [],
        status: "clean",
        page: 0,
    },
    operation: "idle",
    error: null,
};

const orders = createSlice({
    name: "orders",
    initialState,
    reducers: {
        addToCartRequestSent: (orders, action) => {
            orders.operation = "loading";
        },
        addToCartRequestSuccessful: (orders, action) => {
            orders.operation = "success";
        },
        addToCartRequestFailed: (orders, action) => {
            orders.operation = "failed";
        },

        removeFromCartRequestSent: (orders, action) => {
            orders.operation = "loading";
        },
        removeFromCartRequestSuccessful: (orders, action) => {
            orders.operation = "success";
        },
        removeFromCartRequestFailed: (orders, action) => {
            orders.operation = "failed";
        },

        placeOrderRequestSent: (orders, action) => {
            orders.operation = "loading";
        },
        placeOrderRequestSuccessful: (orders, action) => {
            orders.operation = "success";
        },
        placeOrderRequestFailed: (orders, action) => {
            orders.operation = "failed";
        },

        cancelOrderRequestSent: (orders, action) => {
            orders.operation = "loading";
        },
        cancelOrderRequestSuccessful: (orders, action) => {
            orders.operation = "success";
        },
        cancelOrderRequestFailed: (orders, action) => {
            orders.operation = "failed";
        },

        completeOrderRequestSent: (orders, action) => {
            orders.operation = "loading";
        },
        completeOrderRequestSuccessful: (orders, action) => {
            orders.operation = "success";
        },
        completeOrderRequestFailed: (orders, action) => {
            orders.operation = "failed";
        },

        cartOrdersRequestSent: (orders, action) => {
            orders.cart.status = "loading";
        },
        cartOrdersRequestSuccessful: (orders, action) => {
            orders.cart.status = "success";
            orders.cart.data = action.payload.data;
        },
        cartOrdersRequestFailed: (orders, action) => {
            orders.cart.status = "failed";
        },

        orderedOrdersRequestSent: (orders, action) => {
            orders.ordered.status = "loading";
        },
        orderedOrdersRequestSuccessful: (orders, action) => {
            orders.ordered.status = "success";
            orders.ordered.data = action.payload.data;
        },
        orderedOrdersRequestFailed: (orders, action) => {
            orders.ordered.status = "failed";
        },

        soldOrdersRequestSent: (orders, action) => {
            orders.sold.status = "loading";
        },
        soldOrdersRequestSuccessful: (orders, action) => {
            orders.sold.status = "success";
            orders.sold.data = action.payload.data;
        },
        soldOrdersRequestFailed: (orders, action) => {
            orders.sold.status = "failed";
        },

        cleanCart: (orders, action) => {
            orders.cart = {
                data: [],
                status: "clean",
                page: 0,
            };
        },
        setCartPage: (orders, action) => {
            orders.cart.page = action.payload;
        },
        cleanOrdered: (orders, action) => {
            orders.ordered = {
                data: [],
                status: "clean",
                page: 0,
            };
        },
        setOrderedPage: (orders, action) => {
            orders.ordered.page = action.payload;
        },
        cleanSold: (orders, action) => {
            orders.sold = {
                data: [],
                status: "clean",
                page: 0,
            };
        },
        setSoldPage: (orders, action) => {
            orders.sold.page = action.payload;
        },
    },
});

const url = "/orders";

export const addToCart = (itemId) => {
    return apiCallBegan({
        url: url,
        method: "post",
        data: { itemId },
        onStart: addToCartRequestSent.type,
        onSuccess: addToCartRequestSuccessful.type,
        onError: addToCartRequestFailed.type,
        authorized: true,
    });
};

export const requestCartItems = () => {
    return apiCallBegan({
        url: url + "/cart",
        method: "get",
        onStart: cartOrdersRequestSent.type,
        onSuccess: cartOrdersRequestSuccessful.type,
        onError: cartOrdersRequestFailed.type,
        authorized: true,
    });
};

export const requestOrderedItems = () => {
    return apiCallBegan({
        url: url + "/ordered",
        method: "get",
        onStart: orderedOrdersRequestSent.type,
        onSuccess: orderedOrdersRequestSuccessful.type,
        onError: orderedOrdersRequestFailed.type,
        authorized: true,
    });
};

export const requestSoldItems = () => {
    return apiCallBegan({
        url: url + "/sold",
        method: "get",
        onStart: soldOrdersRequestSent.type,
        onSuccess: soldOrdersRequestSuccessful.type,
        onError: soldOrdersRequestFailed.type,
        authorized: true,
    });
};

export const removeOrderFromCart = (orderId) => {
    return apiCallBegan({
        url: url,
        method: "delete",
        data: { orderId },
        onStart: removeFromCartRequestSent.type,
        onSuccess: removeFromCartRequestSuccessful.type,
        onError: removeFromCartRequestFailed.type,
        authorized: true,
    });
};

export const placeOrder = (orderId) => {
    return apiCallBegan({
        url: url + "/ordered",
        method: "put",
        data: { orderId },
        onStart: placeOrderRequestSent.type,
        onSuccess: placeOrderRequestSuccessful.type,
        onError: placeOrderRequestFailed.type,
        authorized: true,
    });
};

export const completeOrder = (orderId) => {
    return apiCallBegan({
        url: url + "/completed",
        method: "put",
        data: { orderId },
        onStart: completeOrderRequestSent.type,
        onSuccess: completeOrderRequestSuccessful.type,
        onError: completeOrderRequestFailed.type,
        authorized: true,
    });
};

export const cancelOrder = (orderId) => {
    return apiCallBegan({
        url: url + "/canceled",
        method: "put",
        data: { orderId },
        onStart: cancelOrderRequestSent.type,
        onSuccess: cancelOrderRequestSuccessful.type,
        onError: cancelOrderRequestFailed.type,
        authorized: true,
    });
};

export const {
    addToCartRequestSent,
    addToCartRequestSuccessful,
    addToCartRequestFailed,
    removeFromCartRequestSent,
    removeFromCartRequestSuccessful,
    removeFromCartRequestFailed,
    placeOrderRequestSent,
    placeOrderRequestSuccessful,
    placeOrderRequestFailed,
    cancelOrderRequestSent,
    cancelOrderRequestSuccessful,
    cancelOrderRequestFailed,
    completeOrderRequestSent,
    completeOrderRequestSuccessful,
    completeOrderRequestFailed,
    cartOrdersRequestSent,
    cartOrdersRequestSuccessful,
    cartOrdersRequestFailed,
    orderedOrdersRequestSent,
    orderedOrdersRequestSuccessful,
    orderedOrdersRequestFailed,
    soldOrdersRequestSent,
    soldOrdersRequestSuccessful,
    soldOrdersRequestFailed,
    cleanCart,
    setCartPage,
    cleanOrdered,
    setOrderedPage,
    cleanSold,
    setSoldPage,
} = orders.actions;
export default orders.reducer;

export const cartSelector = (state) => state.orders.cart;
export const orderedSelector = (state) => state.orders.ordered;
export const soldSelector = (state) => state.orders.sold;
