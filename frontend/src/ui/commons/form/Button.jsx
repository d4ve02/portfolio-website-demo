import React from "react";

const Button = ({
    onClick,
    text,
    className,
    animated,
    icon,
    style,
    optionalInside,
}) => {
    const idleContent = () => (
        <React.Fragment>
            {icon && <i className={`buttonIcon ${icon}`} />}
            {text}
            {animated && (
                <React.Fragment>
                    <div className="buttonDesignOne" />
                    <div className="buttonDesignTwo" />
                </React.Fragment>
            )}
        </React.Fragment>
    );

    const calcOptions = () => {
        for (const index in optionalInside) {
            const option = optionalInside[index];
            if (option.condition) {
                return option.content;
            }
        }

        return idleContent();
    };

    return (
        <button
            style={style}
            className={`formButton ${className}`}
            onClick={onClick}
        >
            {optionalInside ? calcOptions() : idleContent()}
        </button>
    );
};

export default Button;
