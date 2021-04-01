const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const statuses = require("../utils/statuses");

const orderSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    total: {
        type: Number,
        min: 0.01,
        required: true,
    },
    status: {
        type: String,
        minlength: 4,
        maxlength: 10,
        required: true,
    },
});

orderSchema.statics.validateId = (_id) => {
    return new Joi.object({
        _id: Joi.objectId().required(),
    }).validate({ _id }).error;
};

const Order = mongoose.model("order", orderSchema);

module.exports = {
    Order,
};
