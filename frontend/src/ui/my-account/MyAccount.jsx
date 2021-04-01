import Joi from "joi";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    profileFormDataPath,
    profileFormSelector,
} from "../../store/slices/forms";
import Form from "../commons/form/Form";
import "../../css/my-account/MyAccount.css";
import {
    logout,
    updateProfile,
    userDataSelector,
    userUpdateStatusSelector,
    resetStatus,
    deleteProfile,
} from "../../store/slices/auth";
import { redirectToPage } from "../../store/slices/redirect";
import {
    profilePageWallpaper,
    setNewWallpaper,
} from "../../store/slices/wallpaper";

const schema = Joi.object({
    username: Joi.string().required().label("Username"),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
    address: Joi.string().required(),
    password: Joi.string().allow("", null),
    passwordRepeat: Joi.string()
        .equal(Joi.ref("password"))
        .messages({ "any.only": "Passwords must match!" }),
});

const MyAccount = () => {
    const dispatch = useDispatch();
    const dataPath = profileFormDataPath;
    const profileForm = useSelector(profileFormSelector);
    const userData = useSelector(userDataSelector);
    const updateStatus = useSelector(userUpdateStatusSelector);

    const [shouldShowPasswordFields, setShouldShowPasswordFields] = useState(
        false
    );

    useEffect(() => {
        dispatch(setNewWallpaper(profilePageWallpaper));
    }, [dispatch]);

    const passwordSection = shouldShowPasswordFields
        ? [
              {
                  property: "password",
                  type: "password",
                  icon: "fas fa-lock",
                  placeholder: "Set new password",
              },
              {
                  property: "passwordRepeat",
                  type: "password",
                  icon: "fas fa-lock",
                  placeholder: "Repeat New Password",
              },
          ]
        : {
              type: "button",
              text: "Set new password",
              className: "blue",
              icon: "fas fa-lock",
              onClick: () => setShouldShowPasswordFields(true),
              style: {
                  width: "calc(100% - 30px)",
                  maxWidth: "300px",
              },
          };

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
        passwordSection,
        {
            type: "br",
            className: "formSectionBreak",
        },
        {
            type: "button",
            text: "Save",
            className: "blue",
            icon: "fas fa-save",
            style: {
                width: "calc(100% - 30px)",
                fontSize: "1.2rem",
            },
            optionalInside: [
                {
                    condition: updateStatus === "loading",
                    content: <i className="fas fa-spinner formButtonLoading" />,
                },
                {
                    condition: updateStatus === "success",
                    content: <i className="fas fa-check formButtonSuccess" />,
                },
                {
                    condition: updateStatus === "failed",
                    content: <i className="fas fa-times formButtonFail" />,
                },
            ],
        },
        [
            {
                type: "button",
                text: "Logout",
                className: "orange optionsStacked",
                onClick: () => {
                    dispatch(logout());
                    dispatch(redirectToPage({ path: "/" }));
                },
                icon: "fas fa-sign-out-alt",
                style: {
                    borderRadius: "7px",
                },
            },
            {
                type: "button",
                text: "Delete",
                className: "red optionsStacked",
                onClick: () => {
                    dispatch(deleteProfile());
                    dispatch(logout());
                    dispatch(redirectToPage({ path: "/" }));
                },
                icon: "fas fa-trash",
                style: {
                    borderRadius: "7px",
                },
            },
        ],
    ];

    if (updateStatus === "success") {
        setTimeout(() => {
            dispatch(resetStatus());
        }, 2000);
    }

    const doSubmit = () => {
        const { username, email, password, address } = profileForm.data;

        dispatch(updateProfile({ username, email, password, address }));
    };

    return (
        <div className="my-account">
            <div className="stupidFakeProfileImage">
                <i className="fas fa-user stupidFakeProfileImageIcon" />
            </div>

            <Form
                className="profileForm"
                inputs={inputs}
                schema={schema}
                dataPath={dataPath}
                doSubmit={doSubmit}
                outsideData={userData.email ? userData : null}
                optionalBefore={<h1 className="authTitle">Account Settings</h1>}
                optionalAfter={null}
            />
        </div>
    );
};

export default MyAccount;
