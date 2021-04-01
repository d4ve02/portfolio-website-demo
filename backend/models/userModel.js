const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const jwt = require("jsonwebtoken");
const { Item } = require("./itemModel");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true,
    },
    email: {
        type: String,
        minlength: 8,
        maxlength: 255,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true,
    },
    password: {
        type: String,
        minlength: 20,
        maxlength: 255,
        required: true,
    },
    balance: {
        type: Number,
        min: 0,
        default: 4000,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { _id: this._id, isAdmin: this.isAdmin },
        process.env.JWT_PRIVATE_KEY
    );
};

userSchema.statics.validateId = function (data) {
    const schema = new Joi.object({
        _id: Joi.objectId().required(),
    });
    return schema.validate({ _id: data }).error;
};

const User = mongoose.model("user", userSchema);

const joiSchema = new Joi.object({
    username: Joi.string().min(3).max(255).alphanum().required(),
    email: Joi.string().min(8).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
    address: Joi.string().min(3).max(255).required(),
    balance: Joi.number().min(0).precision(2),
    isAdmin: Joi.boolean().required(),
});

const joiSchemaUpdate = new Joi.object({
    username: Joi.string().min(3).max(255).alphanum().allow("", null),
    email: Joi.string().min(8).max(255).email().allow("", null),
    password: Joi.string().min(8).max(255).allow("", null),
    address: Joi.string().min(3).max(255).allow("", null),
});

const joiSchemaLogin = new Joi.object({
    email: Joi.string().min(8).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
});

function validateUserData(data) {
    return joiSchema.validate(data).error;
}

function validateUserLoginCredentials(data) {
    return joiSchemaLogin.validate(data).error;
}

function validateUserUpdateData(data) {
    return joiSchemaUpdate.validate(data).error;
}

module.exports = {
    User,
    validateUserData,
    validateUserLoginCredentials,
    validateUserUpdateData,
};
