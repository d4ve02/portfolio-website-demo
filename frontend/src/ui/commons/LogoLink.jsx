import React from "react";
import { Link } from "react-router-dom";
import "../../css/commons/LogoLink.css";

const LogoLink = ({ signUp }) => {
    if (signUp) {
        return (
            <Link className="logo-link big-link" to="/">
                <span className="logo-title big-title">DΛVIDE HΛLILI</span>
                <span className="logo-subtitle big-subtitle">
                    PORTFOLIO WEBSITE DESIGN
                </span>
            </Link>
        );
    }

    return (
        <Link className="logo-link" to="/">
            <span className="logo-title">DΛVIDE HΛLILI</span>
            <span className="logo-subtitle">PORTFOLIO WEBSITE DESIGN</span>
        </Link>
    );
};

export default LogoLink;
