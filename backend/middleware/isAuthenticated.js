const Joi = require("joi");
const { assert } = require("joi");
const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

module.exports = async function (req, res, next) {
    try {
        assert(req.header("x-auth-token"), Joi.string().required());
    } catch (ex) {
        return res.status(401).send("401. Invalid or no token provided.");
    }

    let payload;

    try {
        payload = jwt.verify(
            req.header("x-auth-token"),
            process.env.JWT_PRIVATE_KEY
        );
    } catch (ex) {
        return res.status(401).send("401. Invalid or no token provided.");
    }

    const user = await User.findById(payload._id);
    if (!user)
        return res
            .status(404)
            .send("404. The account associated with this token was deleted.");

    req.user = payload;
    next();
};
