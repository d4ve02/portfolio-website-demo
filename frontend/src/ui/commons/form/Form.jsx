import React, { useEffect, useState } from "react";
import InputField from "./InputField";
import Button from "./Button";
import "../../../css/commons/form/Form.css";
import { useDispatch, useSelector } from "react-redux";
import {
    formsSelector,
    formSubmitRequested,
    formSubmitted,
    updatedFormData,
} from "../../../store/slices/forms";
import _ from "lodash";
import Select from "./Select";

const validate = (schema, newData) => {
    const result = schema.validate(newData, {
        abortEarly: false,
    });

    if (result.error) {
        const details = result.error.details;

        return details.map((detail) => ({
            message: detail.message,
            path: detail.path[0],
        }));
    }

    return result.error;
};

const Form = (props) => {
    const dispatch = useDispatch();

    const {
        className,
        inputs,
        dataPath,
        doSubmit,
        outsideData,
        optionalBefore,
        optionalAfter,
        schema,
    } = props;

    const form = useSelector(formsSelector(dataPath));
    const data = form.data;
    const errors = form.errors;
    const shouldSubmit = form.submit;
    const [showValidation, setShowValidation] = useState({});
    const [showAllValidation, setShowAllValidation] = useState(false);
    const [localOutsideData, setLocalOutsideData] = useState(null);

    useEffect(() => {
        if (shouldSubmit) {
            dispatch(formSubmitted({ path: dataPath }));
            doSubmit();
        }
    }, [shouldSubmit, doSubmit, dataPath, dispatch]);

    const renderStack = (item) => {
        if (Array.isArray(item)) {
            return (
                <div className="stack" key={item[0].property || item[0].text}>
                    {item.map((input) => renderStack(input))}
                </div>
            );
        } else {
            return renderInput(item);
        }
    };

    const onInputFieldDataChange = (property, propertyUpdatedData) => {
        const newData = { ...data };
        newData[property] = propertyUpdatedData;
        dispatch(
            updatedFormData({
                data: newData,
                path: dataPath,
                validationErrors: validate(schema, newData),
            })
        );
    };

    const onInputFieldBlur = (property) => {
        const newShowValidation = { ...showValidation };
        newShowValidation[property] = true;
        setShowValidation(newShowValidation);
    };

    const renderInput = (input) => {
        const {
            label,
            onClick,
            animated,
            text,
            property,
            type,
            icon,
            style,
            placeholder,
            className,
            optionalInside,
            dropdownOptions,
        } = input;

        if (type === "button") {
            const onClickAction = onClick ? onClick : handleSubmit;
            return (
                <Button
                    key={text}
                    onClick={onClickAction}
                    text={text}
                    className={className}
                    animated={animated}
                    icon={icon}
                    style={style}
                    optionalInside={optionalInside}
                />
            );
        }

        if (type === "dropdown") {
            return (
                <Select
                    outsideData={outsideData && outsideData[property]}
                    key={property}
                    property={property}
                    icon={icon}
                    onInputFieldDataChange={onInputFieldDataChange}
                    onInputFieldBlur={onInputFieldBlur}
                    dropdownOptions={dropdownOptions}
                />
            );
        }

        if (type === "br") {
            return <hr key={className} className={className} />;
        }

        return (
            <InputField
                outsideData={outsideData && outsideData[property]}
                key={property}
                label={label}
                property={property}
                type={type}
                icon={icon}
                placeholder={placeholder}
                error={errors[property]}
                onInputFieldDataChange={onInputFieldDataChange}
                showValidation={showAllValidation || showValidation[property]}
                onInputFieldBlur={onInputFieldBlur}
            />
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setShowAllValidation(true);

        dispatch(formSubmitRequested({ path: dataPath }));
    };

    useEffect(() => {
        if (!_.isEqual(outsideData, localOutsideData)) {
            const newData = { ...data };
            for (const property in outsideData) {
                if (property in data) {
                    newData[property] = outsideData[property];
                }
            }
            dispatch(
                updatedFormData({
                    data: newData,
                    path: dataPath,
                    validationErrors: validate(schema, newData),
                })
            );
            setLocalOutsideData(outsideData);
        }
    }, [outsideData, localOutsideData, data, dispatch, dataPath, schema]);

    return (
        <form
            className={className}
            onSubmit={(e) => e.preventDefault()}
            autoComplete="off"
        >
            {optionalBefore}
            {inputs.map((input) => renderStack(input))}
            {optionalAfter}
        </form>
    );
};

export default Form;
