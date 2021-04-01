import {
    loginRequestFailed,
    signUpRequestFailed,
    userUpdateRequestFailed,
} from "../slices/auth";
import {
    validatedData,
    updatedFormData,
    signUpFormSelector,
    signUpFormDataPath,
    loginFormSelector,
    loginFormDataPath,
    profileFormDataPath,
    profileFormSelector,
} from "../slices/forms";

const findValidationErrorPlaceAndSet = (
    data,
    errors,
    responseError,
    path,
    dispatch
) => {
    let addedError = false;

    for (const property in data) {
        if (responseError.includes(property)) {
            addedError = true;
            const newErrors = { ...errors };
            newErrors[property] = responseError;
            dispatch(
                validatedData({
                    path,
                    errors: newErrors,
                })
            );
        }
    }
    if (!addedError) {
        for (const property in data) {
            const newErrors = { ...errors };
            newErrors[property] = responseError;
            dispatch(
                validatedData({
                    path,
                    errors: newErrors,
                })
            );
            break;
        }
    }
};

const formValidation = ({ dispatch, getState }) => (next) => (action) => {
    if (action.type === updatedFormData.type) {
        const { validationErrors, data, path } = action.payload;

        next(action);

        const errors = {};

        if (!validationErrors) {
            for (const property in data) {
                errors[property] = "";
            }
            dispatch(
                validatedData({
                    path,
                    errors,
                })
            );
        } else {
            for (let item of validationErrors) errors[item.path] = item.message;
            dispatch(validatedData({ path, errors }));
        }
    } else if (action.type === signUpRequestFailed.type) {
        next(action);

        const { data, errors } = signUpFormSelector(getState());
        const responseError = action.payload;
        const path = signUpFormDataPath;

        findValidationErrorPlaceAndSet(
            data,
            errors,
            responseError,
            path,
            dispatch
        );
    } else if (action.type === loginRequestFailed.type) {
        next(action);

        const { data, errors } = loginFormSelector(getState());
        const responseError = action.payload;
        const path = loginFormDataPath;

        findValidationErrorPlaceAndSet(
            data,
            errors,
            responseError,
            path,
            dispatch
        );
    } else if (action.type === userUpdateRequestFailed.type) {
        next(action);

        const { data, errors } = profileFormSelector(getState());
        const responseError = action.payload;
        const path = profileFormDataPath;

        findValidationErrorPlaceAndSet(
            data,
            errors,
            responseError,
            path,
            dispatch
        );
    } else {
        next(action);
    }
};

export default formValidation;
