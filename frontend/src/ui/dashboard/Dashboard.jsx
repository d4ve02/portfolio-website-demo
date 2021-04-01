import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../css/dashboard/Dashboard.css";
import { balanceSelector } from "../../store/slices/auth";
import {
    cartSelector,
    cleanCart,
    orderedSelector,
    soldSelector,
    requestCartItems,
    requestOrderedItems,
    requestSoldItems,
    cleanOrdered,
    cleanSold,
} from "../../store/slices/orders";
import {
    setNewWallpaper,
    dashboardWallpaper,
} from "../../store/slices/wallpaper";
import Cart from "./Cart";
import Orders from "./Orders";
import Sold from "./Sold";

const Dashboard = () => {
    const dispatch = useDispatch();
    const balance = useSelector(balanceSelector);
    const cart = useSelector(cartSelector);
    const ordered = useSelector(orderedSelector);
    const sold = useSelector(soldSelector);

    useEffect(() => {
        dispatch(setNewWallpaper(dashboardWallpaper));
    }, [dispatch]);

    useEffect(() => {
        if (cart.data.length === 0 && cart.status === "clean") {
            dispatch(requestCartItems());
        }
        if (ordered.data.length === 0 && ordered.status === "clean") {
            dispatch(requestOrderedItems());
        }
        if (sold.data.length === 0 && sold.status === "clean") {
            dispatch(requestSoldItems());
        }
    }, [dispatch, cart, ordered, sold]);

    useEffect(() => {
        return () => {
            dispatch(cleanCart());
            dispatch(cleanOrdered());
            dispatch(cleanSold());
        };
    }, [dispatch]);

    return (
        <div className="dashboard">
            <h1 className="dashboardTitle">Dashboard</h1>
            <h2 className="balance">Balance: {balance.toFixed(2)}⨵</h2>
            <div className="topSectionDashboard">
                <Cart />
                <Orders />
            </div>
            <Sold />
        </div>
    );
};

export default Dashboard;
