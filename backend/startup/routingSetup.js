const express = require("express");
const authRouter = require("../routes/authRouter");
const userRouter = require("../routes/userRouter");
const itemsRouter = require("../routes/itemsRouter");
const imagesRouter = require("../routes/imagesRouter");
const ordersRouter = require("../routes/ordersRouter");
const path = require("path");

module.exports = (app) => {
    app.use("/images", express.static("public/product_images"));
    app.use("/api/auth", authRouter);
    app.use("/api/users", userRouter);
    app.use("/api/items", itemsRouter);
    app.use("/api/images", imagesRouter);
    app.use("/api/orders", ordersRouter);
};
