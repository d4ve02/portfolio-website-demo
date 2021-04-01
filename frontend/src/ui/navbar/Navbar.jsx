import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavbarMenu from "./NavbarMenu";
import NavbarMenuButton from "./NavbarMenuButton";
import LogoLink from "../commons/LogoLink";
import Profile from "./Profile";
import "../../css/navbar/Navbar.css";
import DashboardLink from "./Dashboard";

const Navbar = () => {
    const [showLeftMenu, setShowLeftMenu] = useState(false);

    const menuStyle = {
        left: showLeftMenu ? "0px" : "-241px",
        boxShadow:
            "0px 0px 0px 100vw rgba(0, 0, 0, " + (showLeftMenu ? "0.9)" : "0)"),
    };
    const navbarLinks = (
        <React.Fragment>
            <Link className="navbar-link" to="/marketplace">
                Marketplace
            </Link>
            <Link className="navbar-link" to="/my-products">
                My Products
            </Link>
            <a
                className="navbar-link"
                href="https://github.com/d4ve02/portfolio-website-demo"
                target="_blank"
                rel="noreferrer"
            >
                About
            </a>
        </React.Fragment>
    );

    const closeMenu = () => {
        setShowLeftMenu(false);
    };
    const triggerMenu = () => {
        setShowLeftMenu(!showLeftMenu);
    };

    return (
        <div>
            <React.Fragment>
                <NavbarMenu
                    styleObject={menuStyle}
                    closeMenuFunction={closeMenu}
                />

                <div className="navbar">
                    <div className="navbar-left-links">
                        <NavbarMenuButton triggerMenu={triggerMenu} />
                        <LogoLink />
                        {navbarLinks}
                    </div>

                    <div className="navbar-right-links">
                        <DashboardLink
                            itemsShoppingCart={12}
                            soldItemsPending={10}
                        />
                        <Profile />
                    </div>
                </div>
            </React.Fragment>
        </div>
    );
};

export default Navbar;
