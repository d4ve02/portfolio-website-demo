router = require("express").Router();
const logger = require("../utils/logger");
const _ = require("lodash");
const isAuthenticated = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/isAdmin");
const bcrypt = require("bcrypt");
const handleErrors = require("../middleware/errorHandler");

const {
    User,
    validateUserData,
    validateUserUpdateData,
} = require("../models/userModel");
const {
    deleteAllOrdersAssociatedWithUser,
    deleteAllItemsAssociatedWithUser,
} = require("./helpers/deleter");

router.get(
    "/",
    isAuthenticated,
    handleErrors(async (req, res) => {
        const user = await User.findOne({ _id: req.user._id });

        logger.verbose("Retrieved user data.");
        res.send(_.pick(user, ["username", "email", "address", "balance"]));
    })
);

router.put(
    "/",
    isAuthenticated,
    handleErrors(async (req, res) => {
        const data = _.pick(req.body, [
            "username",
            "email",
            "address",
            "password",
        ]);
        const validate = validateUserUpdateData(data);

        if (validate) {
            return res
                .status(400)
                .send(`Invalid data submitted: ${validate.message}`);
        }

        const user = await User.findOne({ _id: req.user._id });

        if (data.password) {
            const salt = await bcrypt.genSalt(10);
            data.password = await bcrypt.hash(data.password, salt);
        } else {
            data.password = user.password;
        }

        data.balance = user.balance;
        data.isAdmin = user.isAdmin;

        const newUser = await User.findOneAndUpdate(
            { _id: req.user._id },
            data,
            { new: true }
        );
        logger.info("Updated user account.");
        res.send(
            _.pick(newUser, [
                "_id",
                "username",
                "email",
                "address",
                "balance",
                "isAdmin",
            ])
        );
    })
);

router.post(
    "/",
    handleErrors(async (req, res) => {
        const data = _.pick(req.body, [
            "username",
            "email",
            "password",
            "address",
            "isAdmin",
        ]);
        const validate = validateUserData(data);

        if (validate) {
            return res
                .status(400)
                .send(`Invalid data submitted: ${validate.message}`);
        }

        if (data.isAdmin) {
            const admin = await User.findOne({ isAdmin: true });
            if (admin) {
                return res.status(403).send(`There is already an admin.`);
            }
        }

        const user = await User.findOne({ email: data.email });
        if (user) {
            return res
                .status(400)
                .send(`There is already an account with this email.`);
        }

        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);

        const newUser = await new User(data).save();
        logger.info("New user account created.");
        res.send(
            _.pick(newUser, [
                "_id",
                "username",
                "email",
                "address",
                "balance",
                "isAdmin",
            ])
        );
    })
);

router.delete(
    "/my-account",
    isAuthenticated,
    handleErrors(async (req, res) => {
        await deleteAllOrdersAssociatedWithUser(req.user._id);
        await deleteAllItemsAssociatedWithUser(req.user._id);

        const user = await User.findOneAndDelete({ _id: req.user._id });

        logger.info("Deleted user account.");
        res.send(
            _.pick(user, ["_id", "username", "email", "address", "balance"])
        );
    })
);

router.delete(
    "/",
    [isAuthenticated, isAdmin],
    handleErrors(async (req, res) => {
        const data = req.body._id;
        if (!data) {
            return res.status(400).send(`Invalid data submitted: no id.`);
        }

        const validate = User.validateId(data);
        if (validate) {
            return res.status(400).send(`Invalid id submitted.`);
        }

        const user = await User.findById(data);
        if (!user) {
            return res.status(404).send(`No user with this id was found.`);
        }

        await deleteAllOrdersAssociatedWithUser(req.user._id);
        await deleteAllItemsAssociatedWithUser(req.user._id);
        const deletedUser = await User.findByIdAndDelete(user._id);

        logger.info("Admin deleted user account.");
        res.send(
            _.pick(deletedUser, [
                "_id",
                "username",
                "email",
                "address",
                "balance",
            ])
        );
    })
);

module.exports = router;
