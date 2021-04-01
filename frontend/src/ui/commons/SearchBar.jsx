import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { redirectToPage } from "../../store/slices/redirect";
import "../../css/commons/SearchBar.css";
import { changedPage, requestItems } from "../../store/slices/items";

const SearchBar = ({
    shouldRedirect,
    value,
    onFilterChange,
    marketplaceSubmitHandler,
}) => {
    const dispatch = useDispatch();

    const [localValue, setLocalValue] = useState("");

    const onSearchChange = ({ currentTarget: input }) => {
        if (onFilterChange) {
            onFilterChange(input.value);
        } else {
            setLocalValue(input.value);
        }
    };

    const doSubmit = (e) => {
        e.preventDefault();

        if (shouldRedirect) {
            dispatch(redirectToPage({ path: `/marketplace` }));
        }

        if (marketplaceSubmitHandler) {
            marketplaceSubmitHandler();
        } else {
            dispatch(requestItems({ search: localValue }));
            dispatch(changedPage(0));
        }
    };

    return (
        <form className="searchBarForm" onSubmit={doSubmit}>
            <div className="formInputDiv">
                <i className={"fas fa-search formIcon"}></i>
                <input
                    type="text"
                    placeholder={"What are you looking for?"}
                    className={`formLabel`}
                    value={value}
                    onChange={onSearchChange}
                />
            </div>
        </form>
    );
};

export default SearchBar;
