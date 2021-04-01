import React, { useEffect, useState } from "react";

const InputField = (props) => {
    const {
        outsideData,
        label,
        property,
        type,
        icon,
        placeholder,
        className,
        error,
        onInputFieldDataChange,
        showValidation,
        onInputFieldBlur,
    } = props;

    const [data, setData] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (outsideData) {
            setData(outsideData);
        }
    }, [outsideData]);

    const onChange = ({ currentTarget: input }) => {
        setData(input.value);
        onInputFieldDataChange(property, input.value);
    };

    const onBlur = () => {
        onInputFieldDataChange(property, data);
        onInputFieldBlur(property);
    };

    const renderError = () => {
        if (showValidation) {
            return (
                <div
                    style={{
                        right: type === "password" ? "2.7rem" : "0.85rem",
                    }}
                    className="validationErrorDiv"
                >
                    <span
                        style={{
                            backgroundColor: showError
                                ? "rgba(230, 61, 61, 0.9)"
                                : "rgba(230, 61, 61, 0)",
                            color: showError
                                ? "rgba(245, 245, 245, .9)"
                                : "rgba(0, 0, 0, 0)",
                        }}
                        className="validationErrorMessage"
                    >
                        {showError && error}
                    </span>
                    <i
                        onMouseEnter={() => setShowError(true)}
                        onMouseLeave={() => setShowError(false)}
                        onClick={() => setShowError(!showError)}
                        className="fas fa-exclamation-circle validationErrorCircle"
                    />
                </div>
            );
        }
        return null;
    };

    return (
        <div
            className="formInputDiv"
            style={label && { marginTop: "calc(7px + 1.2rem)" }}
        >
            {label && <div className="inputFieldLabel">{label}</div>}
            <i className={`${icon} formIcon`}></i>
            <input
                type={
                    type !== "password"
                        ? type
                        : showPassword
                        ? "text"
                        : "password"
                }
                name={property}
                id={property}
                placeholder={placeholder}
                className={`formLabel ${className}`}
                value={data}
                onChange={onChange}
                onBlur={onBlur}
            />
            {error && renderError()}
            {type === "password" && (
                <i
                    className={
                        "fas formPasswordEye fa-eye" +
                        (showPassword ? "" : "-slash")
                    }
                    onClick={() => setShowPassword(!showPassword)}
                />
            )}
        </div>
    );
};

export default InputField;
