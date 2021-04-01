import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    cartSelector,
    placeOrder,
    removeOrderFromCart,
    setCartPage,
} from "../../store/slices/orders";
import { backendUrl } from "../../utils/constants";
import Paginate from "../commons/Paginate";

const itemsPerList = 6;

const Cart = () => {
    const dispatch = useDispatch();
    const cart = useSelector(cartSelector);

    const generateCartList = () => {
        const cartList = [];
        let toRender = [];
        let start = cart.page * itemsPerList;

        if (start >= cart.data.length) {
            return null;
        }

        for (let i = 0; i < itemsPerList; i++) {
            if (start + i < cart.data.length) {
                toRender.push(cart.data[start + i]);
            } else {
                break;
            }
        }

        const addCell = (content, className, style) => {
            cartList.push(
                <div
                    style={style}
                    className={`orderCell ${className}`}
                    key={cartList.length}
                >
                    {content}
                </div>
            );
        };

        addCell(null, "noBackground");
        addCell("Name", "headerCell noBackground", { justifyContent: "left" });
        addCell("Price", "headerCell noBackground");
        addCell(null, "noBackground");
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
            addCell(`${order.total}⨵`);
            addCell(
                <button
                    className="ordersButton blue"
                    style={{ fontSize: ".95rem" }}
                    onClick={() => {
                        dispatch(placeOrder(order._id.toString()));
                    }}
                >
                    <i className="fas fa-truck" />
                </button>,
                "noPadding"
            );
            addCell(
                <button
                    className="ordersButton red"
                    onClick={() => {
                        dispatch(removeOrderFromCart(order._id.toString()));
                    }}
                >
                    <i className="fas fa-times" />
                </button>,
                "last"
            );
        });

        return cartList;
    };

    return (
        <div className="orderSection">
            <h3 className="sectionTitle">
                <i className="fas fa-shopping-cart" /> My Cart
            </h3>
            {cart.data.length !== 0 ? (
                <div
                    className="cartList"
                    style={{
                        gridTemplateRows: `2rem repeat(${
                            cart.data.length < 5 ? cart.data.length : 6
                        }, 60px)`,
                    }}
                >
                    {generateCartList()}
                </div>
            ) : (
                <h2 className="nothingToSee">Nothing to see here!</h2>
            )}

            <Paginate
                page={cart.page}
                setPage={(n) => {
                    dispatch(setCartPage(n));
                }}
                itemsPerPage={itemsPerList}
                count={cart.data.length}
            />
        </div>
    );
};

export default Cart;
