import { loginRequestSuccessful } from "../slices/auth";
import { productDeleteSuccessful } from "../slices/items";
import { redirectToPage } from "../slices/redirect";

const redirect = ({ dispatch }) => (next) => (action) => {
    next(action);
    if (action.type === loginRequestSuccessful.type) {
        dispatch(redirectToPage({ path: "/" }));
    } else if (action.type === productDeleteSuccessful.type) {
        dispatch(redirectToPage({ path: "/my-products" }));
    }
};

export default redirect;
