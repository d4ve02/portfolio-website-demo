import React, { useEffect } from "react";
import Joi from "joi";
import { Link } from "react-router-dom";
import LogoLink from "../commons/LogoLink";
import "../../css/authentication/AuthForm.css";
import "../../css/authentication/SignUpForm.css";
import Form from "../commons/form/Form";
import { jwtSelector, signUp } from "../../store/slices/auth";
import { useDispatch, useSelector } from "react-redux";
import {
    signUpFormDataPath,
    signUpFormSelector,
} from "../../store/slices/forms";
import { redirectToPage } from "../../store/slices/redirect";
import {
    authenticationWallpaper,
    setNewWallpaper,
} from "../../store/slices/wallpaper";

const schema = Joi.object({
    username: Joi.string().required().label("Username"),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
    address: Joi.string().required(),
    password: Joi.string().required(),
    passwordRepeat: Joi.string()
        .required()
        .equal(Joi.ref("password"))
        .messages({ "any.only": "Passwords must match!" }),
});

const SignUp = () => {
    const dispatch = useDispatch();
    const signUpForm = useSelector(signUpFormSelector);
    const dataPath = signUpFormDataPath;
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
            property: "username",
            type: "text",
            icon: "fas fa-user",
            placeholder: "Full Name",
        },
        {
            property: "email",
            type: "text",
            icon: "fas fa-envelope",
            placeholder: "Email",
        },
        {
            property: "address",
            type: "text",
            icon: "fas fa-map-marked",
            placeholder: "Address",
        },
        [
            {
                property: "password",
                type: "password",
                icon: "fas fa-lock",
                placeholder: "Password",
            },
            {
                property: "passwordRepeat",
                type: "password",
                icon: "fas fa-lock",
                placeholder: "Repeat Password",
            },
        ],
        {
            type: "br",
            className: "formSectionBreak",
        },
        {
            type: "button",
            animated: true,
            text: "Sign Up",
            className: "Auth blue",
        },
    ];

    const doSubmit = () => {
        const { username, email, password, address } = signUpForm.data;

        dispatch(
            signUp({ username, email, password, address, isAdmin: false })
        );
    };

    return (
        <div className="signup">
            <div className="formWrap">
                <LogoLink signUp />
                <Form
                    className="signupForm"
                    inputs={inputs}
                    schema={schema}
                    dataPath={dataPath}
                    doSubmit={doSubmit}
                    optionalBefore={<h1 className="authTitle">Sign Up</h1>}
                    optionalAfter={
                        <p className="formSuggestion">
                            Already have an account?
                            <Link className="signInLink" to="/login">
                                Login
                            </Link>
                        </p>
                    }
                />
            </div>
        </div>
    );
};

export default SignUp;
