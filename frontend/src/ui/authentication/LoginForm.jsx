import React, { useEffect } from "react";
import Joi from "joi";
import { Link } from "react-router-dom";
import LogoLink from "../commons/LogoLink";
import "../../css/authentication/AuthForm.css";
import "../../css/authentication/LoginForm.css";
import Form from "../commons/form/Form";
import { jwtSelector, login } from "../../store/slices/auth";
import { useDispatch, useSelector } from "react-redux";
import { loginFormDataPath, loginFormSelector } from "../../store/slices/forms";
import { redirectToPage } from "../../store/slices/redirect";
import {
    authenticationWallpaper,
    setNewWallpaper,
} from "../../store/slices/wallpaper";

const schema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
    password: Joi.string().required(),
});

const Login = () => {
    const dispatch = useDispatch();
    const loginForm = useSelector(loginFormSelector);
    const dataPath = loginFormDataPath;
    const jwt = useSelector(jwtSelector);

    useEffect(() => {
        dispatch(setNewWallpaper(authenticationWallpaper));
    }, [dispatch]);

    useEffect(() => {
        if (jwt) {
            dispatch(redirectToPage({ path: "/" }));
        }
    }, [jwt, dispatch]);

    const inputs = [
        {
            property: "email",
            type: "text",
            icon: "fas fa-envelope",
            placeholder: "Email",
        },
        {
            property: "password",
            type: "password",
            icon: "fas fa-lock",
            placeholder: "Password",
        },

        {
            type: "br",
            className: "formSectionBreak",
        },
        {
            type: "button",
            animated: true,
            text: "Login",
            className: "Auth blue",
        },
    ];

    const doSubmit = () => {
        const { email, password } = loginForm.data;

        dispatch(login({ email, password }));
    };

    return (
        <div className="login">
            <div className="formWrap">
                <LogoLink signUp />
                <Form
                    className="loginForm"
                    inputs={inputs}
                    schema={schema}
                    dataPath={dataPath}
                    doSubmit={doSubmit}
                    optionalBefore={<h1 className="authTitle">Login</h1>}
                    optionalAfter={
                        <p className="formSuggestion">
                            Don't have an account?
                            <Link className="signInLink" to="/sign-up">
                                Sign Up
                            </Link>
                        </p>
                    }
                />
            </div>
        </div>
    );
};

export default Login;
