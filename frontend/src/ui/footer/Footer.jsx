import React from "react";
import FooterLink from "./FooterLink";
import "../../css/footer/Footer.css";

const Footer = () => {
    return (
        <footer>
            <div className="footer-main">
                <ul className="footer-section">
                    <h2 className="footer-section-title">MY FRONTEND SKILLS</h2>
                    <FooterLink
                        iconColor="e34f26"
                        icon="fab fa-html5"
                        link="#"
                        text="HTML5"
                    />
                    <FooterLink
                        iconColor="2965f1"
                        icon="fab fa-css3"
                        link="#"
                        text="CSS3"
                    />
                    <FooterLink
                        iconColor="f0db4f "
                        icon="fab fa-js"
                        link="#"
                        text="JS ES6"
                    />
                    <FooterLink
                        iconColor="61DBFB"
                        icon="fab fa-react"
                        link="#"
                        text="React"
                    />
                    <FooterLink
                        iconColor="563d7c"
                        icon="fab fa-bootstrap"
                        link="#"
                        text="Bootstrap"
                    />
                </ul>
                <ul className="footer-section">
                    <h2 className="footer-section-title">MY BACKEND SKILLS</h2>
                    <FooterLink
                        iconColor="6cc24a"
                        icon="fab fa-node-js"
                        link="#"
                        text="NodeJS"
                    />
                    <FooterLink
                        iconColor="f29111"
                        icon="fas fa-database"
                        link="#"
                        text="MySQL"
                    />
                    <FooterLink
                        iconColor="4DB33D"
                        icon="fas fa-database"
                        link="#"
                        text="MongoDB"
                    />
                    <FooterLink
                        iconColor="7f3df2"
                        icon="fab fa-github"
                        link="#"
                        text="Git"
                    />
                    <FooterLink
                        iconColor="6eebeb"
                        icon="fas fa-vial"
                        link="#"
                        text="Jest"
                    />
                </ul>
                <ul className="footer-section">
                    <h2 className="footer-section-title">ADDITIONAL SKILLS</h2>
                    <FooterLink
                        iconColor="764abc"
                        icon="fas fa-atlas"
                        link="#"
                        text="Redux"
                    />
                    <FooterLink
                        iconColor="4B8BBE"
                        icon="fab fa-python"
                        link="#"
                        text="Python"
                    />
                    <FooterLink
                        iconColor="f89820"
                        icon="fab fa-java"
                        link="#"
                        text="Java"
                    />

                    <FooterLink
                        iconColor="91db58"
                        icon="fas fa-crop-alt"
                        link="#"
                        text="Minimalist Web Design"
                    />
                    <FooterLink
                        iconColor="cf3c3c"
                        icon="fas fa-paint-brush"
                        link="#"
                        text="Logo Design"
                    />
                </ul>
            </div>
            <div className="closing-footer">
                &#169; 2021 Your Company. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
