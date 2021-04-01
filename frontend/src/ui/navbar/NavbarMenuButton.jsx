import React from "react";
import "../../css/navbar/NavbarMenuButton.css";

const NavbarMenuButton = ({ triggerMenu }) => {
    return (
        <button className="navbar-collapse" onClick={triggerMenu}>
            <i className="fas fa-bars" />
        </button>
    );
};

export default NavbarMenuButton;
