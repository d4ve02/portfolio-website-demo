import { createSlice } from "@reduxjs/toolkit";
import * as api from "../middleware/apiActions";
import _ from "lodash";

const items = createSlice({
    name: "items",
    initialState: {
        expoItems: {
            hottest: [],
            recommended: [],
            status: "idle",
        },
        searched: {
            list: [],
            status: "idle",
            page: 0,
        },
        product: {
            data: {
                _id: "",
                name: "",
                rating: "",
                description: "",
                stock: "",
                price: "",
                imagePath: "",
                sellerId: "",
            },
            status: "idle",
            updateStatus: "idle",
        },
        imagePaths: {
            data: [],
            status: "idle",
        },
    },
    reducers: {
        hottestExpoItemsRequested: (items, action) => {
            items.expoItems.status = "loading";
        },
        hottestExpoItemsReceived: (items, action) => {
            items.expoItems.status = "received";
            items.expoItems.hottest = action.payload.data;
        },
        hottestExpoItemsRequestFailed: (items, action) => {
            items.expoItems.status = "failed";
        },

        recommendedExpoItemsRequested: (items, action) => {
            items.expoItems.status = "loading";
        },
        recommendedExpoItemsReceived: (items, action) => {
            items.expoItems.status = "received";
            items.expoItems.recommended = action.payload.data;
        },
        recommendedExpoItemsRequestFailed: (items, action) => {
            items.expoItems.status = "failed";
        },

        itemsRequested: (items, action) => {
            items.searched.status = "loading";
        },
        itemsReceived: (items, action) => {
            items.searched.status = "received";
            items.searched.list = action.payload.data;
        },
        itemsRequestFailed: (items, action) => {
            items.searched.status = "failed";
        },

        changedPage: (items, action) => {
            items.searched.page = action.payload;
        },

        productRequested: (items, action) => {
            items.product.status = "loading";
        },
        productReceived: (items, action) => {
            items.product.status = "received";
            items.product.data = _.omit(action.payload.data, ["__v"]);
        },
        productRequestFailed: (items, action) => {
            items.product.status = "failed";
        },

        productUpdateRequested: (items, action) => {
            items.product.updateStatus = "loading";
        },
        productUpdateSuccessful: (items, action) => {
            items.product.updateStatus = "success";
            items.product.data = _.omit(action.payload.data, ["__v"]);
        },
        productUpdateFailed: (items, action) => {
            items.product.updateStatus = "failed";
        },

        productDeleteRequested: (items, action) => {},
        productDeleteSuccessful: (items, action) => {},
        productDeleteFailed: (items, action) => {},

        imagePathsRequested: (items, action) => {
            items.imagePaths.data = [];
            items.imagePaths.status = "loading";
        },

        imagePathsReceived: (items, action) => {
            items.imagePaths.data = action.payload.data;
            items.imagePaths.status = "received";
        },
        imagePathsRequestFailed: (items, action) => {
            items.imagePaths.data = "Something went wrong";
            items.imagePaths.status = "failed";
        },

        resetStatus: (items, action) => {
            items.product.updateStatus = "idle";
        },

        resetProductData: (items, action) => {
            items.product = {
                data: {
                    _id: "",
                    name: "",
                    rating: "",
                    description: "",
                    stock: "",
                    price: "",
                    imagePath: "",
                    sellerId: "",
                },
                status: "idle",
                updateStatus: "idle",
            };
        },

        resetSearchedItems: (items, action) => {
            items.searched = {
                list: [],
                status: "idle",
                page: 0,
            };
        },
    },
});

export const {
    hottestExpoItemsRequested,
    hottestExpoItemsReceived,
    hottestExpoItemsRequestFailed,
    recommendedExpoItemsRequested,
    recommendedExpoItemsReceived,
    recommendedExpoItemsRequestFailed,
    itemsRequested,
    itemsReceived,
    itemsRequestFailed,
    productRequested,
    productReceived,
    productRequestFailed,
    imagePathsRequested,
    imagePathsReceived,
    imagePathsRequestFailed,
    productUpdateRequested,
    productUpdateSuccessful,
    productUpdateFailed,
    productDeleteRequested,
    productDeleteSuccessful,
    productDeleteFailed,
    changedPage,
    resetStatus,
    resetProductData,
    resetSearchedItems,
} = items.actions;
export default items.reducer;

const url = "/items";

export const requestHottestExpoItems = () => {
    return api.apiCallBegan({
        url: url + "/hot",
        method: "get",
        onStart: hottestExpoItemsRequested.type,
        onSuccess: hottestExpoItemsReceived.type,
        onError: hottestExpoItemsRequestFailed.type,
    });
};

export const requestRecommendedExpoItems = () => {
    return api.apiCallBegan({
        url: url + "/recommended",
        method: "get",
        onStart: recommendedExpoItemsRequested.type,
        onSuccess: recommendedExpoItemsReceived.type,
        onError: recommendedExpoItemsRequestFailed.type,
    });
};

export const requestItems = (data) => {
    return api.apiCallBegan({
        url: url,
        method: "get",
        params: data,
        onStart: itemsRequested.type,
        onSuccess: itemsReceived.type,
        onError: itemsRequestFailed.type,
    });
};

export const requestImagePaths = () => {
    return api.apiCallBegan({
        url: "/images",
        method: "get",
        onStart: imagePathsRequested.type,
        onSuccess: imagePathsReceived.type,
        onError: imagePathsRequestFailed.type,
    });
};

export const requestProduct = (id) => {
    return api.apiCallBegan({
        url: url,
        method: "get",
        params: {
            itemId: id,
        },
        onStart: productRequested.type,
        onSuccess: productReceived.type,
        onError: productRequestFailed.type,
    });
};

export const updateProduct = (data) => {
    return api.apiCallBegan({
        url: url,
        method: "put",
        data: data,
        onStart: productUpdateRequested.type,
        onSuccess: productUpdateSuccessful.type,
        onError: productUpdateFailed.type,
        authorized: true,
    });
};

export const createProduct = (data) => {
    return api.apiCallBegan({
        url: url,
        method: "post",
        data: data,
        onStart: productUpdateRequested.type,
        onSuccess: productUpdateSuccessful.type,
        onError: productUpdateFailed.type,
        authorized: true,
    });
};

export const deleteProduct = (_id) => {
    return api.apiCallBegan({
        url: url,
        method: "delete",
        data: { _id },
        onStart: productDeleteRequested.type,
        onSuccess: productDeleteSuccessful.type,
        onError: productDeleteFailed.type,
        authorized: true,
    });
};

export const expoItemsSelector = (state) => state.items.expoItems;
export const itemsSelector = (state) => state.items.searched;
export const productSelector = (state) => state.items.product;
export const imagePathsSelector = (state) => state.items.imagePaths.data;
export const imagePathsStatusSelector = (state) =>
    state.items.imagePaths.status;
export const productDataSelector = (state) => state.items.product.data;
export const itemUpdateStatusSelector = (state) =>
    state.items.product.updateStatus;
