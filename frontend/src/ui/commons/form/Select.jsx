import React, { useEffect, useState } from "react";

const Select = ({
    outsideData,
    property,
    icon,
    onInputFieldDataChange,
    onInputFieldBlur,
    dropdownOptions,
}) => {
    const [data, setData] = useState("");

    useEffect(() => {
        if (outsideData) {
            setData(outsideData);
            onInputFieldDataChange(property, outsideData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outsideData]);

    const onChange = ({ currentTarget: input }) => {
        setData(input.value);
        onInputFieldDataChange(property, input.value);
    };

    const onBlur = () => {
        onInputFieldDataChange(property, data);
        onInputFieldBlur(property);
    };

    let dropdown = null;

    if (dropdownOptions.length !== 0) {
        dropdown = dropdownOptions.map((optionObject) => (
            <option
                className="formSelectOption"
                key={optionObject.path}
                value={optionObject.path}
            >
                {optionObject.name}
            </option>
        ));
    }

    useEffect(() => {
        if (data === "" && dropdownOptions.length !== 0 && !outsideData) {
            setData(dropdownOptions[0].path);
            onInputFieldDataChange(property, dropdownOptions[0].path);
        }
    }, [
        data,
        dropdownOptions,
        setData,
        property,
        onInputFieldDataChange,
        outsideData,
    ]);

    return (
        <div className="formInputDiv">
            <i className={`${icon} formIcon`}></i>
            <select
                className="formSelect"
                value={data}
                onChange={onChange}
                onBlur={onBlur}
            >
                {dropdown}
            </select>
        </div>
    );
};

export default Select;
