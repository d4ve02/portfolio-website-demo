import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    signUpFormData: {
        data: {
            username: "",
            email: "",
            address: "",
            password: "",
            passwordRepeat: "",
        },
        errors: {
            username: "",
            email: "",
            address: "",
            password: "",
            passwordRepeat: "",
        },
        submit: false,
    },
    loginFormData: {
        data: {
            email: "",
            password: "",
        },
        errors: {
            email: "",
            password: "",
        },
        submit: false,
    },
    searchFormData: {
        data: {
            text: "",
            rating: 0,
            priceMin: 0,
            priceMax: 0,
        },
        errors: {
            text: "",
        },
        submit: false,
    },
    profileFormData: {
        data: {
            username: "",
            email: "",
            address: "",
            password: "",
            passwordRepeat: "",
        },
        errors: {
            username: "",
            email: "",
            address: "",
            password: "",
            passwordRepeat: "",
        },
        submit: false,
        delete: false,
        logout: false,
    },
    productFormData: {
        data: {
            name: "",
            description: "",
            stock: "",
            price: "",
            imagePath: "",
        },
        errors: {
            name: "",
            description: "",
            stock: "",
            price: "",
            imagePath: "",
        },
        submit: false,
        delete: false,
    },
};

const forms = createSlice({
    name: "forms",
    initialState,
    reducers: {
        updatedFormData: (forms, action) => {
            forms[action.payload.path].data = action.payload.data;
            forms[action.payload.path].submit = false;
        },

        validatedData: (forms, action) => {
            forms[action.payload.path].errors = action.payload.errors;
        },

        formSubmitRequested: (forms, action) => {
            const dataPath = action.payload.path;
            forms[dataPath].submit = true;
            let errorPresence = false;
            let dataPresence = false;
            for (const property in forms[dataPath].errors) {
                if (forms[dataPath].errors[property]) {
                    errorPresence = true;
                }
            }
            for (const property in forms[dataPath].data) {
                if (forms[dataPath].data[property]) {
                    dataPresence = true;
                }
            }
            if (errorPresence || !dataPresence) {
                forms[dataPath].submit = false;
            }
        },

        formSubmitted: (forms, action) => {
            forms[action.payload.path].submit = false;
        },

        resetProductForm: (forms, action) => {
            forms.productFormData = {
                data: {
                    name: "",
                    description: "",
                    stock: "",
                    price: "",
                    imagePath: "",
                },
                errors: {
                    name: "",
                    description: "",
                    stock: "",
                    price: "",
                    imagePath: "",
                },
                submit: false,
                delete: false,
            };
        },
    },
});

export const {
    updatedFormData,
    validatedData,
    formSubmitRequested,
    formSubmitted,
    resetProductForm,
} = forms.actions;
export default forms.reducer;

export const formsSelector = (dataPath) => (state) => state.forms[dataPath];

export const signUpFormSelector = (state) => state.forms.signUpFormData;
export const loginFormSelector = (state) => state.forms.loginFormData;
export const searchFormSelector = (state) => state.forms.searchFormData;
export const profileFormSelector = (state) => state.forms.profileFormData;
export const productFormSelector = (state) => state.forms.productFormData;

export const signUpFormDataPath = "signUpFormData";
export const loginFormDataPath = "loginFormData";
export const searchFormDataPath = "searchFormData";
export const profileFormDataPath = "profileFormData";
export const productFormDataPath = "productFormData";
