import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    cancelOrder,
    completeOrder,
    orderedSelector,
    setOrderedPage,
} from "../../store/slices/orders";
import { backendUrl } from "../../utils/constants";
import Paginate from "../commons/Paginate";

const itemsPerList = 6;

const Orders = () => {
    const dispatch = useDispatch();
    const ordered = useSelector(orderedSelector);

    const generateOrderedList = () => {
        // Order function based on status
        const compare = (firstEl, secondEl) => {
            if (firstEl.status === secondEl.stauts) {
                return 0;
            }

            if (firstEl.status === "ordered") {
                return -1;
            } else {
                if (firstEl.status === "canceled") {
                    return 1;
                } else {
                    return -1;
                }
            }
        };

        const orderedList = [];
        let toRender = [];
        let start = ordered.page * itemsPerList;

        const sortedData = [...ordered.data].sort(compare);

        if (start >= sortedData.length) {
            return null;
        }

        for (let i = 0; i < itemsPerList; i++) {
            if (start + i < sortedData.length) {
                toRender.push(sortedData[start + i]);
            } else {
                break;
            }
        }

        const addCell = (content, className, style) => {
            orderedList.push(
                <div
                    style={style}
                    className={`orderCell ${className}`}
                    key={orderedList.length}
                >
                    {content}
                </div>
            );
        };

        addCell(null, "noBackground");
        addCell("Name", "headerCell noBackground", { justifyContent: "left" });
        addCell("Status", "headerCell noBackground");
        addCell("Price", "headerCell noBackground");
        addCell(null, "noBackground");
        addCell(null, "noBackground");

        toRender.forEach((order) => {
            addCell(
                <img
                    className="orderImage"
                    src={backendUrl + order.item.imagePath}
                    alt="product representation"
                />
            );

            addCell(order.item.name, null, { justifyContent: "left" });

            if (order.status === "ordered") {
                addCell(<i className="fas fa-truck status" />);
            } else if (order.status === "cart") {
                addCell(<i className="fas fa-shopping-cart status" />);
            } else if (order.status === "canceled") {
                addCell(<i className="fas fa-times status" />);
            } else if (order.status === "completed") {
                addCell(<i className="fas fa-check status" />);
            }

            addCell(`${order.total}⨵`);
            addCell(
                <button
                    className={`ordersButton green ${
                        order.status === "ordered" ? "" : "disabled"
                    }`}
                    style={{ fontSize: ".95rem" }}
                    onClick={() => {
                        dispatch(completeOrder(order._id.toString()));
                    }}
                    disabled={order.status !== "ordered"}
                >
                    <i className="fas fa-check" />
                </button>,
                "noPadding"
            );
            addCell(
                <button
                    className={`ordersButton red ${
                        order.status === "ordered" ? "" : "disabled"
                    }`}
                    onClick={() => {
                        dispatch(cancelOrder(order._id.toString()));
                    }}
                    disabled={order.status !== "ordered"}
                >
                    <i className="fas fa-times" />
                </button>,
                "last"
            );
        });

        return orderedList;
    };

    return (
        <div className="orderSection">
            <h3 className="sectionTitle">
                <i className="fas fa-truck" /> My Orders
            </h3>
            {ordered.data.length !== 0 ? (
                <div
                    className="orderList"
                    style={{
                        gridTemplateRows: `2rem repeat(${
                            ordered.data.length < 5
                                ? 1 + ordered.data.length
                                : 6
                        }, 60px)`,
                    }}
                >
                    {generateOrderedList()}
                </div>
            ) : (
                <h2 className="nothingToSee">Nothing to see here!</h2>
            )}
            <Paginate
                page={ordered.page}
                setPage={(n) => {
                    dispatch(setOrderedPage(n));
                }}
                itemsPerPage={itemsPerList}
                count={ordered.data.length}
            />
        </div>
    );
};

export default Orders;
