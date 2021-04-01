import axios from "axios";
import { backendUrl } from "../../utils/constants";
import { jwtSelector } from "../slices/auth";
import * as apiActions from "./apiActions";

const api = ({ dispatch, getState }) => (next) => async (action) => {
    if (action.type !== apiActions.apiCallBegan.type) return next(action);

    const {
        url,
        method,
        data,
        params,
        onStart,
        onSuccess,
        onError,
        authorized,
    } = action.payload;

    if (onStart) dispatch({ type: onStart });

    const headers = {};

    if (authorized) {
        headers["x-auth-token"] = jwtSelector(getState());
    }

    try {
        const response = await axios.request({
            url,
            baseURL: backendUrl + "/api",
            method,
            params,
            data,
            headers,
        });
        if (onSuccess)
            dispatch({
                type: onSuccess,
                payload: { data: response.data, headers: response.headers },
            });
        else dispatch(apiActions.apiCallSuccess(response.data));
    } catch (error) {
        if (onError)
            if (error.response) {
                dispatch({
                    type: onError,
                    payload: error.response.data,
                });
            } else {
                dispatch({
                    type: onError,
                    payload: error.message,
                });
            }
        else dispatch(apiActions.apiCallFailed(error.message));
    }
};

export default api;
