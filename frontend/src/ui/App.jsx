import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import LandingPage from "./landing-page/LandingPage";
import Footer from "./footer/Footer";
import Navbar from "./navbar/Navbar";
import "../css/App.css";
import NotFound from "./not-found/NotFound";
import { Provider, useDispatch, useSelector } from "react-redux";
import setupStore from "../store/setupStore";
import SignUp from "./authentication/SignUpForm";
import { redirected, redirectSelector } from "../store/slices/redirect";
import React, { useEffect } from "react";
import {
    deleteAuthenticationToken,
    getUserData,
    jwtSelector,
    loadedAuthenticationToken,
} from "../store/slices/auth";
import Login from "./authentication/LoginForm";
import MyAccount from "./my-account/MyAccount";
import { wallpaperSelector } from "../store/slices/wallpaper";
import Marketplace from "./marketplace/Marketplace";
import ProductDetails from "./product-details/ProductDetails";
import MyProducts from "./my-products/MyProducts";
import Protected from "./authentication/Protected";
import AddProduct from "./my-products/AddProduct";
import Dashboard from "./dashboard/Dashboard";
import Toast from "./commons/Toast";

const store = setupStore();

const CompleteWebiste = () => {
    const jwt = useSelector(jwtSelector);

    const authorized = (path, component) => {
        return <Route path={path} component={jwt ? component : Protected} />;
    };

    return (
        <React.Fragment>
            <Navbar />
            <Switch>
                <Route path="/not-found" component={NotFound} />
                <Route path="/protected" component={Protected} />
                {authorized("/my-account", MyAccount)}
                {authorized("/my-products", MyProducts)}
                {authorized("/item/:id", ProductDetails)}
                {authorized("/new-item", AddProduct)}
                {authorized("/dashboard", Dashboard)}
                <Route path="/marketplace" component={Marketplace} />
                <Route path="/" exact component={LandingPage} />
                <Redirect to="/not-found" />
            </Switch>
            <Footer />
        </React.Fragment>
    );
};

const RedirectorAndLoader = () => {
    const redirectPath = useSelector(redirectSelector);
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        if (redirectPath) {
            dispatch(redirected());
            history.push(redirectPath);
        }
    }, [history, redirectPath, dispatch]);

    // Load JWT if present, delete it if there's none
    const storedJwt = window.localStorage.getItem("x-auth-token");

    useEffect(() => {
        if (storedJwt) {
            dispatch(loadedAuthenticationToken(storedJwt));
            dispatch(getUserData());
        } else {
            dispatch(deleteAuthenticationToken());
        }
    }, [storedJwt, dispatch]);

    // Load wallpaper
    const wallpaper = useSelector(wallpaperSelector);
    const style = {
        backgroundImage: `url(/wallpapers/${wallpaper.path})`,
        backgroundPositionX: `center`,
        backgroundPositionY: `center`,
        backgroundSize: "cover",
        height: "100vh",
    };

    return (
        <main className="main">
            <div className="wallpaper" style={style}></div>
            <div className="mainContent">
                <Toast />
                <Switch>
                    <Route path="/sign-up" component={SignUp} />
                    <Route path="/login" component={Login} />
                    <Route path="/" component={CompleteWebiste} />
                </Switch>
            </div>
        </main>
    );
};

const App = () => {
    return (
        <Provider store={store}>
            <RedirectorAndLoader />
        </Provider>
    );
};

export default App;
