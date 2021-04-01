import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    cancelOrder,
    setSoldPage,
    soldSelector,
} from "../../store/slices/orders";
import { backendUrl } from "../../utils/constants";
import Paginate from "../commons/Paginate";

const itemsPerList = 6;

const Sold = () => {
    const dispatch = useDispatch();
    const sold = useSelector(soldSelector);

    const generateSoldList = () => {
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

        const soldList = [];
        let toRender = [];
        let start = sold.page * itemsPerList;

        const sortedData = [...sold.data].sort(compare);

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
            soldList.push(
                <div
                    style={style}
                    className={`orderCell ${className}`}
                    key={soldList.length}
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

        toRender.forEach((order) => {
            addCell(
                <img
                    className="orderImage"
                    src={backendUrl + order.item.imagePath}
                    alt="product representation"
                />,
                "first"
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

        return soldList;
    };

    return (
        <div className="orderSection">
            <h3 className="sectionTitle">
                <i className="fas fa-money-bill" /> Sales
            </h3>
            {sold.data.length !== 0 ? (
                <div
                    className="soldList"
                    style={{
                        gridTemplateRows: `2rem repeat(${
                            sold.data.length < 5 ? 1 + sold.data.length : 6
                        }, 60px)`,
                    }}
                >
                    {generateSoldList()}
                </div>
            ) : (
                <h2 className="nothingToSee">Nothing to see here!</h2>
            )}
            <Paginate
                page={sold.page}
                setPage={(n) => {
                    dispatch(setSoldPage(n));
                }}
                itemsPerPage={itemsPerList}
                count={sold.data.length}
            />
        </div>
    );
};

export default Sold;
