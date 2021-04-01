const router = require("express").Router();
const handleErrors = require("../middleware/errorHandler");
const _ = require("lodash");
const isAuthenticated = require("../middleware/isAuthenticated");
const { Order } = require("../models/orderModel");
const logger = require("../utils/logger");
const { Item } = require("../models/itemModel");
const { User } = require("../models/userModel");
const { db } = require("../startup/dbSetup");
const mongoose = require("mongoose");
const { assert } = require("joi");
const Joi = require("joi");

router.get(
    "/cart",
    isAuthenticated,
    handleErrors(async (req, res) => {
        const filter = {
            buyerId: req.user._id,
            status: "cart",
        };

        const orders = await Order.find(filter);

        for (let i = 0; i < orders.length; i++) {
            const item = await Item.findById(orders[i].itemId);
            orders[i] = orders[i].toObject();
            orders[i].item = item;
        }

        logger.verbose("Retrieved cart orders.");
        res.send(orders);
    })
);

router.get(
    "/ordered",
    isAuthenticated,
    handleErrors(async (req, res) => {
        const filter = {
            buyerId: req.user._id,
            $or: [
                { status: "ordered" },
                { status: "canceled" },
                { status: "completed" },
            ],
        };

        const orders = await Order.find(filter);
        for (let i = 0; i < orders.length; i++) {
            const item = await Item.findById(orders[i].itemId);
            orders[i] = orders[i].toObject();
            orders[i].item = item;
        }
        logger.verbose("Retrieved ordered orders.");
        res.send(orders);
    })
);

router.get(
    "/sold",
    isAuthenticated,
    handleErrors(async (req, res) => {
        const filter = {
            sellerId: req.user._id,
        };

        const orders = await Order.find(filter);
        for (let i = 0; i < orders.length; i++) {
            const item = await Item.findById(orders[i].itemId);
            orders[i] = orders[i].toObject();
            orders[i].item = item;
        }
        logger.verbose("Retrieved sold orders.");
        res.send(orders);
    })
);

router.post(
    "/",
    isAuthenticated,
    handleErrors(async (req, res) => {
        const data = req.body.itemId;

        const validate = Order.validateId(data);
        if (validate) {
            return res.status(400).send("No id or invalid id submitted.");
        }

        const item = await Item.findById(data);
        if (!item) {
            return res.status(404).send("No item found with this id.");
        }

        if (item.sellerId.equals(req.user._id)) {
            return res.status(400).send("You can't buy your own products!");
        }

        const order = await new Order({
            buyerId: req.user._id,
            sellerId: item.sellerId,
            itemId: item._id,
            total: item.price,
            status: "cart",
        }).save();

        logger.info("Added item to cart.");
        res.send(order);
    })
);

router.put(
    "/ordered",
    isAuthenticated,
    handleErrors(async (req, res) => {
        const data = req.body.orderId;

        const validate = Order.validateId(data);
        if (validate) {
            return res.status(400).send("No id or invalid id submitted.");
        }

        const order = await Order.findById(data);
        if (!order) {
            return res.status(404).send("No order with given id exists.");
        }

        if (order.status !== "cart") {
            return res.status(400).send("Order must be in cart to be ordered.");
        }

        if (!order.buyerId.equals(req.user._id)) {
            return res
                .status(403)
                .send("You can't alter another user's order.");
        }

        const item = await Item.findById(order.itemId);
        const buyer = await User.findById(order.buyerId);
        const seller = await User.findById(order.sellerId);

        if (order.total > buyer.balance) {
            return res.status(400).send("Balance is too low to buy item.");
        }

        await User.findByIdAndUpdate(buyer._id, {
            balance: buyer.balance - order.total,
        });

        await User.findByIdAndUpdate(seller._id, {
            balance: seller.balance + order.total,
        });

        const updatedOrder = await Order.findByIdAndUpdate(
            order._id,
            {
                status: "ordered",
            },
            { new: true }
        );

        logger.info("Placed order on item.");
        res.send(updatedOrder);
    })
);

router.put(
    "/canceled",
    isAuthenticated,
    handleErrors(async (req, res) => {
        const data = req.body.orderId;

        const validate = Order.validateId(data);
        if (validate) {
            return res.status(400).send("No id or invalid id submitted.");
        }

        const order = await Order.findById(data);
        if (!order) {
            return res.status(404).send("No order with given id exists.");
        }

        if (order.status !== "ordered") {
            return res
                .status(400)
                .send("Order must be ordered to be canceled.");
        }

        if (
            !order.buyerId.equals(req.user._id) &&
            !order.sellerId.equals(req.user._id)
        ) {
            return res
                .status(403)
                .send(
                    "You can't alter another user's order unless you're selling that item."
                );
        }

        const item = await Item.findById(order.itemId);
        const buyer = await User.findById(order.buyerId);
        const seller = await User.findById(order.sellerId);

        await User.findByIdAndUpdate(buyer._id, {
            balance: buyer.balance + order.total,
        });

        await User.findByIdAndUpdate(seller._id, {
            balance: seller.balance - order.total,
        });

        const updatedOrder = await Order.findByIdAndUpdate(
            order._id,
            {
                status: "canceled",
            },
            { new: true }
        );

        logger.info("Canceled order.");
        res.send(updatedOrder);
    })
);

router.put(
    "/completed",
    isAuthenticated,
    handleErrors(async (req, res) => {
        const data = req.body.orderId;

        const validate = Order.validateId(data);
        if (validate) {
            return res.status(400).send("No id or invalid id submitted.");
        }

        const order = await Order.findById(data);
        if (!order) {
            return res.status(404).send("No order with given id exists.");
        }

        if (order.status !== "ordered") {
            return res
                .status(400)
                .send("Order must be ordered to be canceled.");
        }

        if (!order.buyerId.equals(req.user._id)) {
            return res
                .status(403)
                .send("You can't alter another user's order.");
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            order._id,
            {
                status: "completed",
            },
            { new: true }
        );

        logger.info("Completed order.");
        res.send(updatedOrder);
    })
);

router.delete(
    "/",
    isAuthenticated,
    handleErrors(async (req, res) => {
        const data = req.body.orderId;

        const validate = Order.validateId(data);
        if (validate) {
            return res.status(400).send("No id or invalid id submitted.");
        }

        const order = await Order.findById(data);
        if (!order) {
            return res.status(404).send("No order with given id exists.");
        }

        if (order.status !== "cart") {
            return res.status(400).send("Order must be in cart to be deleted.");
        }

        if (!order.buyerId.equals(req.user._id)) {
            return res
                .status(403)
                .send("You can't alter another user's order.");
        }

        const deletedOrder = await Order.findByIdAndDelete(order._id);

        logger.info("Removed order from cart.");
        res.send(deletedOrder);
    })
);

module.exports = router;
