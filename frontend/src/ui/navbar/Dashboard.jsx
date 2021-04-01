import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../../css/navbar/DashboardLink.css";
import { jwtSelector } from "../../store/slices/auth";
import {
    cartSelector,
    orderedSelector,
    requestCartItems,
    requestOrderedItems,
} from "../../store/slices/orders";

const DashboardLink = (props) => {
    const dispatch = useDispatch();
    const cart = useSelector(cartSelector);
    const ordered = useSelector(orderedSelector);
    const jwt = useSelector(jwtSelector);

    useEffect(() => {
        if (jwt) {
            if (cart.data.length === 0 && cart.status === "clean") {
                dispatch(requestCartItems());
            }
            if (ordered.data.length === 0 && ordered.status === "clean") {
                dispatch(requestOrderedItems());
            }
        }
    }, [dispatch, cart, ordered, jwt]);

    const cartItems = cart.data.length;
    const pendingOrders = ordered.data.filter(
        (order) => order.status === "ordered"
    ).length;

    return (
        <Link className="dashboardLink" to="/dashboard">
            <i className="fas fa-clipboard-list" />
            {cartItems === 0 ? null : (
                <div className="shopping-cart-items">
                    <div className="shopping-cart-items-count">{cartItems}</div>
                </div>
            )}
            {pendingOrders === 0 ? null : (
                <div className="sold-items-pending">
                    <div className="sold-items-pending-count">
                        {pendingOrders}
                    </div>
                </div>
            )}
        </Link>
    );
};

export default DashboardLink;
