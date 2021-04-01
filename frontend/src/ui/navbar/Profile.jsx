import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../../css/navbar/Profile.css";
import { jwtSelector } from "../../store/slices/auth";

const Profile = () => {
    const jwt = useSelector(jwtSelector);

    if (jwt) {
        return (
            <Link className="profile" to="/my-account">
                <div className="profile-circle"></div>
                <i className="fas fa-user profile-user-icon-logged-in" />
            </Link>
        );
    } else {
        return (
            <Link className="profile" to="/login">
                <div className="login-button">
                    <i className="fas fa-user profile-user-icon-logged-out" />
                    <span className="login-link">Login</span>
                </div>
            </Link>
        );
    }
};

export default Profile;
