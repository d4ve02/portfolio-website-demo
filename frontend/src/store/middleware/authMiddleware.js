import {
    logout,
    login,
    loginRequestSuccessful,
    signUpRequestSuccessful,
    userDataRequestFailed,
} from "../slices/auth";
import { signUpFormSelector } from "../slices/forms";

const auth = ({ dispatch, getState }) => (next) => (action) => {
    if (action.type === signUpRequestSuccessful.type) {
        next(action);

        const { email, password } = signUpFormSelector(getState()).data;

        dispatch(login({ email, password }));
    } else if (action.type === loginRequestSuccessful.type) {
        next(action);

        window.localStorage.setItem(
            "x-auth-token",
            action.payload.headers["x-auth-token"]
        );
    } else if (action.type === userDataRequestFailed.type) {
        next(action);

        dispatch(logout());
    } else {
        next(action);
    }
};
export default auth;
