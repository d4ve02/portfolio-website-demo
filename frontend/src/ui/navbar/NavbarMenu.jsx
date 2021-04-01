import React from "react";
import { Link } from "react-router-dom";
import "../../css/navbar/NavbarMenu.css";

const NavbarMenu = ({ styleObject, closeMenuFunction }) => {
    return (
        <div className="navbar-collapse-menu" style={styleObject}>
            <div className="navbar-collapse-menu-items">
                <Link
                    className="navbar-link"
                    to="/marketplace"
                    onClick={closeMenuFunction}
                >
                    Marketplace
                </Link>
                <Link
                    className="navbar-link"
                    to="/my-products"
                    onClick={closeMenuFunction}
                >
                    My Products
                </Link>
                <a
                    className="navbar-link"
                    href="https://github.com/d4ve02/portfolio-website-demo"
                    target="_blank"
                    rel="noreferrer"
                    onClick={closeMenuFunction}
                >
                    About
                </a>
            </div>
            <i
                className="fas fa-times navbar-collapse-menu-button"
                onClick={closeMenuFunction}
            />
        </div>
    );
};

export default NavbarMenu;
