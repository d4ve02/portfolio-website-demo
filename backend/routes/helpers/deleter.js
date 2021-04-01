const { Item } = require("../../models/itemModel");
const { Order } = require("../../models/orderModel");
const { User } = require("../../models/userModel");
const logger = require("../../utils/logger");

const deleteAllOrdersAssociatedWithItem = async (itemId) => {
    const validate = Item.validateId(itemId.toString());

    if (validate) {
        throw new Error("itemId must be a valid id.");
    }

    const item = await Item.findById(itemId);
    if (!item) {
        return null;
    }

    const orders = await Order.find({ itemId });

    for (let order of orders) {
        if (order.status === "ordered") {
            const buyer = await User.findById(order.buyerId);
            const seller = await User.findById(order.sellerId);

            await User.findByIdAndUpdate(buyer._id, {
                balance: buyer.balance + order.total,
            });

            await User.findByIdAndUpdate(seller._id, {
                balance: seller.balance - order.total,
            });
        }

        await Order.findByIdAndRemove(order._id);
        logger.verbose("Deleted order associated with item.");
    }

    return orders;
};

const deleteAllOrdersAssociatedWithUser = async (userId) => {
    const validate = User.validateId(userId.toString());

    if (validate) {
        throw new Error("userId must be a valid id.");
    }

    const user = await User.findById(userId);
    if (!user) {
        return null;
    }

    const orders = await Order.find({
        $or: [{ buyerId: userId }, { sellerId: userId }],
    });

    for (let order of orders) {
        if (order.status === "ordered") {
            const buyer = await User.findById(order.buyerId);
            const seller = await User.findById(order.sellerId);

            await User.findByIdAndUpdate(buyer._id, {
                balance: buyer.balance + order.total,
            });

            await User.findByIdAndUpdate(seller._id, {
                balance: seller.balance - order.total,
            });
        }

        await Order.findByIdAndRemove(order._id);
        logger.verbose("Deleted order associated with user.");
    }

    return orders;
};

const deleteAllItemsAssociatedWithUser = async (userId) => {
    const validate = User.validateId(userId.toString());

    if (validate) {
        throw new Error("userId must be a valid id.");
    }

    const user = await User.findById(userId);
    if (!user) {
        return null;
    }

    const items = await Item.find({
        sellerId: userId,
    });

    for (let item of items) {
        await deleteAllOrdersAssociatedWithItem(item._id);
        await Item.findByIdAndRemove(item._id);
        logger.verbose("Deleted item associated with user.");
    }

    return items;
};

module.exports = {
    deleteAllOrdersAssociatedWithItem,
    deleteAllItemsAssociatedWithUser,
    deleteAllOrdersAssociatedWithUser,
};
