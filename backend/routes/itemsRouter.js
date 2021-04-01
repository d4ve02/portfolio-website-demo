const isAuthenticated = require("../middleware/isAuthenticated");
const _ = require("lodash");
const {
    validateItemData,
    Item,
    validateSearchData,
    validateItemUpdateData,
} = require("../models/itemModel");
const { User } = require("../models/userModel");
const logger = require("../utils/logger");
const handleErrors = require("../middleware/errorHandler");
const { deleteAllOrdersAssociatedWithItem } = require("./helpers/deleter");

router = require("express").Router();

router.get(
    "/hot",
    handleErrors(async (req, res) => {
        const items = [];
        let iterations = 0;

        const count = await Item.countDocuments();

        while (items.length < 6) {
            const random = Math.trunc(Math.random() * count);
            const item = await Item.findOne().skip(random);
            let duplicate = false;

            items.forEach((itemStored) => {
                if (item._id.toString() === itemStored._id.toString()) {
                    duplicate = true;
                }
            });

            if (!duplicate) {
                iterations = 0;
                items.push(item);
            }

            iterations++;
            if (iterations > 100) {
                break;
            }
        }

        logger.verbose("Hot expo item data retrieved.");
        res.send(items);
    })
);

router.get(
    "/recommended",
    handleErrors(async (req, res) => {
        const items = [];
        let iterations = 0;

        const count = await Item.countDocuments();

        while (items.length < 6) {
            const random = Math.trunc(Math.random() * count);
            const item = await Item.findOne().skip(random);
            let duplicate = false;

            items.forEach((itemStored) => {
                if (item._id.toString() === itemStored._id.toString()) {
                    duplicate = true;
                }
            });

            if (!duplicate) {
                iterations = 0;
                items.push(item);
            }

            iterations++;
            if (iterations > 100) {
                break;
            }
        }

        logger.verbose("Recommended expo item data retrieved.");
        res.send(items);
    })
);

router.get(
    "/",
    handleErrors(async (req, res) => {
        const data = _.pick(req.query, [
            "itemId",
            "search",
            "rating",
            "stock",
            "priceMin",
            "priceMax",
            "sellerId",
        ]);

        if (!data.stock) data.stock = 0;
        if (!data.rating) data.rating = 0;
        if (!data.priceMin) data.priceMin = 0;
        if (!data.priceMax) data.priceMax = 1000;
        if (!data.search) data.search = "";

        const validate = validateSearchData(data);
        if (validate) {
            return res
                .status(400)
                .send(`Invalid data submitted: ${validate.message}`);
        }

        if (data.sellerId) {
            const seller = await User.findById(data.sellerId);
            if (!seller) {
                return res
                    .status(404)
                    .send("There's no account associated with this sellerId.");
            }

            const items = await Item.find({ sellerId: seller._id });

            return res.send(items);
        }

        if (data.itemId) {
            const item = await Item.findById(data.itemId);
            if (!item) {
                return res
                    .status(404)
                    .send("There's no item associated with this itemId.");
            }

            return res.send(item);
        }

        const items = await Item.find({
            $or: [
                { name: { $regex: data.search, $options: "i" } },
                { description: { $regex: data.search, $options: "i" } },
            ],
            stock: { $gte: data.stock },
            rating: { $gte: data.rating },
            price: { $gte: data.priceMin, $lte: data.priceMax },
        });

        logger.verbose("Retrieved item data.");
        res.send(items.slice(0, 200));
    })
);

router.post(
    "/",
    isAuthenticated,
    handleErrors(async (req, res) => {
        const data = _.pick(req.body, [
            "name",
            "description",
            "stock",
            "price",
            "imagePath",
        ]);

        data.sellerId = req.user._id;
        data.rating = (Math.random() * 5).toFixed(2);

        const validate = validateItemData(data);
        if (validate) {
            return res
                .status(400)
                .send(`Invalid data submitted: ${validate.message}`);
        }

        const item = await new Item(data).save();
        logger.info("New item was added.");
        res.send(item);
    })
);

router.put(
    "/",
    isAuthenticated,
    handleErrors(async (req, res) => {
        const data = _.pick(req.body, [
            "_id",
            "name",
            "description",
            "stock",
            "price",
            "imagePath",
        ]);

        const validate = validateItemUpdateData(data);
        if (validate) {
            return res
                .status(400)
                .send(`Invalid data submitted: ${validate.message}`);
        }

        const item = await Item.findById(data._id);
        if (!item) {
            return res.status(404).send("Item with given id not found.");
        }

        if (!item.sellerId.equals(req.user._id)) {
            return res
                .status(403)
                .send("You can't update items that are not yours.");
        }

        const newItem = await Item.findOneAndUpdate(
            { _id: item._id },
            _.omit(data, ["_id"]),
            { new: true }
        );

        logger.info("Item updated.");
        res.send(newItem);
    })
);

router.delete(
    "/",
    isAuthenticated,
    handleErrors(async (req, res) => {
        const id = req.body._id;

        const validate = Item.validateId(id);
        if (validate) {
            return res
                .status(400)
                .send(`Invalid id submitted: ${validate.message}`);
        }

        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).send("Item with given id not found.");
        }

        if (!item.sellerId.equals(req.user._id)) {
            return res
                .status(403)
                .send("You can't delete items that are not yours.");
        }

        await deleteAllOrdersAssociatedWithItem(item._id);
        const deletedItem = await Item.findOneAndDelete({ _id: item._id });

        logger.info("Item deleted.");
        res.send(deletedItem);
    })
);

module.exports = router;
