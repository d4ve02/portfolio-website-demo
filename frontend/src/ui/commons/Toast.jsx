import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../css/commons/Toast.css";
import { toastAccepted, toastSelector } from "../../store/slices/toast";

const Toast = () => {
    const dispatch = useDispatch();
    const toastData = useSelector(toastSelector);

    const { accepted, message, button } = toastData;

    let style = {
        pointerEvents: "auto",
        backgroundColor: "var(--transparent-dark-color)",
        backdropFilter: "blur(10px)",
        filter: "opacity(1)",
    };

    if (accepted) {
        style = {
            pointerEvents: "none",
            backgroundColor: "rgba(0, 0, 0, 0)",
            backdropFilter: "none",
            filter: "opacity(0)",
        };
    }

    return (
        <div className="contentHider" style={style}>
            <div className="toast">
                <div className="toastContent">
                    <i className="fas fa-exclamation-triangle" />
                    <p>{message}</p>
                </div>
                <button onClick={() => dispatch(toastAccepted())}>
                    {button}
                </button>
            </div>
        </div>
    );
};

export default Toast;
