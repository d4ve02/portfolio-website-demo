const mongoose = require("mongoose");
const Joi = require("joi");
const { Order } = require("./orderModel");
Joi.objectId = require("joi-objectid")(Joi);
const imagePathsAvailable = require("../utils/imagePaths").map(
    (image) => image.path
);

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    description: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true,
    },
    stock: {
        type: Number,
        min: 0,
        max: 1000,
        default: 1,
    },
    price: {
        type: Number,
        min: 0,
        max: 1000,
        required: true,
    },
    imagePath: {
        type: String,
        minlength: 3,
        maxlength: 255,
        default: null,
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
});

itemSchema.statics.validateId = function (data) {
    const schema = new Joi.object({
        _id: Joi.objectId().required(),
    });
    return schema.validate({ _id: data }).error;
};

const Item = mongoose.model("item", itemSchema);

const joiSchema = new Joi.object({
    name: Joi.string()
        .min(3)
        .max(255)
        .regex(/^[\w ]+$/)
        .required(),
    rating: Joi.number().min(0).max(5).precision(1),
    description: Joi.string()
        .min(3)
        .max(255)
        .regex(/^[\w ]+$/)
        .required(),
    stock: Joi.number().integer().min(0).max(1000),
    price: Joi.number().precision(2).min(0).max(1000).required(),
    imagePath: Joi.string().valid(...imagePathsAvailable),
    sellerId: Joi.objectId().required(),
});

const joiSchemaUpdate = new Joi.object({
    _id: Joi.objectId().required(),
    name: Joi.string()
        .min(3)
        .max(255)
        .regex(/^[\w ]+$/)
        .allow("", null),
    description: Joi.string()
        .min(3)
        .max(255)
        .regex(/^[\w ]+$/)
        .allow("", null),
    stock: Joi.number().integer().min(0).max(1000).allow("", null),
    price: Joi.number().precision(2).min(0).max(1000).allow("", null),
    imagePath: Joi.string()
        .valid(...imagePathsAvailable)
        .allow("", null),
});

const joiSchemaSearch = new Joi.object({
    itemId: Joi.objectId().allow("", null),
    search: Joi.string()
        .min(1)
        .max(255)
        .regex(/^[\w ]+$/)
        .allow("", null),
    stock: Joi.number().integer().min(0).max(1000).allow("", null),
    priceMin: Joi.number().min(0).precision(2).max(1000).allow("", null),
    priceMax: Joi.number().min(0).precision(2).max(1000).allow("", null),
    rating: Joi.number().min(0).max(5).precision(1).allow("", null),
    sellerId: Joi.objectId().allow("", null),
});

function validateItemData(data) {
    return joiSchema.validate(data).error;
}

function validateItemUpdateData(data) {
    return joiSchemaUpdate.validate(data).error;
}

function validateSearchData(data) {
    return joiSchemaSearch.validate(data).error;
}

module.exports = {
    Item,
    validateItemData,
    validateItemUpdateData,
    validateSearchData,
};
