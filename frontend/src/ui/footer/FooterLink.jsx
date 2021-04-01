import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../css/footer/FooterLink.css";

const FooterLink = ({ icon, link, text, iconColor }) => {
    const [hover, setHover] = useState(false);

    const style = {
        color: "#" + (hover ? iconColor : "fff"),
    };

    return (
        <li
            className="footer-li"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <i style={style} className={"footer-icons " + icon} />
            <Link className="footer-link" to={link}>
                {text}
            </Link>
        </li>
    );
};

export default FooterLink;
