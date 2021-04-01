const { User } = require("../../../models/userModel");
const { Item } = require("../../../models/itemModel");
const { Order } = require("../../../models/orderModel");
const mongoose = require("mongoose");
const {
    deleteAllOrdersAssociatedWithItem,
    deleteAllItemsAssociatedWithUser,
    deleteAllOrdersAssociatedWithUser,
} = require("../../../routes/helpers/deleter");

let server;
const setupServer = () => {
    server = require("../../../index");
};

let users = [];
let items = [];
let orders = [];

beforeEach(async () => {
    setupServer();

    for (let i = 0; i < 10; i++) {
        users.push(
            await new User({
                username: `User ${i}`,
                email: `seller${i}@email.com`,
                address: `Seller ${i} address`,
                password: `12345678901234567890`,
                balance: 200,
                isAdmin: false,
            }).save()
        );
    }

    for (let i = 0; i < 10; i++) {
        items.push(
            await new Item({
                name: `Item ${i}`,
                rating: 5,
                description: `A very cool item nr.${i}`,
                stock: 1,
                price: 100,
                sellerId: users[i],
            }).save()
        );
    }

    for (let i = 0; i < 10; i++) {
        orders.push(
            await new Order({
                buyerId: users[i]._id,
                sellerId: users[9 - i]._id,
                itemId: items[i]._id,
                total: items[i].price,
                status: "ordered",
            }).save()
        );
        orders.push(
            await new Order({
                buyerId: users[i]._id,
                sellerId: users[9 - i]._id,
                itemId: items[i]._id,
                total: items[i].price,
                status: "cart",
            }).save()
        );
    }
});

afterEach(async () => {
    await User.deleteMany({});
    await Item.deleteMany({});
    await Order.deleteMany({});
    await new Promise((resolve, reject) => {
        server.close(resolve);
    });

    users = [];
    items = [];
    orders = [];
});

describe("deleteAllOrdersAssociatedWithItem", () => {
    it("should delete all orders associated with a particular item and update their balances if it was ordered.", async () => {
        const order = orders[0];
        const buyer = await User.findById(orders[0].buyerId);
        const seller = await User.findById(orders[0].sellerId);

        const res = await deleteAllOrdersAssociatedWithItem(items[0]._id);

        const savedOrders = await Order.find({ itemId: items[0]._id });
        const savedBuyer = await User.findById(buyer._id);
        const savedSeller = await User.findById(seller._id);
        const totalOrders = await Order.find({});

        expect(res.length).toBe(2);
        expect(savedOrders.length).toBe(0);
        expect(totalOrders.length).toBe(18);
        expect(savedBuyer.balance).toBe(buyer.balance + order.total);
        expect(savedSeller.balance).toBe(seller.balance - order.total);
    });

    it("should throw an error if itemId passed isn't valid", async () => {
        const buyer = await User.findById(orders[0].buyerId);
        const seller = await User.findById(orders[0].sellerId);

        let errorMessage;
        try {
            await deleteAllOrdersAssociatedWithItem(-5);
        } catch (ex) {
            errorMessage = ex.message;
        }

        const savedOrders = await Order.find({ itemId: items[0]._id });
        const savedBuyer = await User.findById(buyer._id);
        const savedSeller = await User.findById(seller._id);
        const totalOrders = await Order.find({});

        expect(savedOrders.length).toBe(2);
        expect(totalOrders.length).toBe(20);
        expect(savedBuyer.balance).toBe(buyer.balance);
        expect(savedSeller.balance).toBe(seller.balance);
        expect(errorMessage).toMatch("itemId must be a valid id.");
    });

    it("should return null if itemId doesn't match any item", async () => {
        const buyer = await User.findById(orders[0].buyerId);
        const seller = await User.findById(orders[0].sellerId);

        const result = await deleteAllOrdersAssociatedWithItem(
            mongoose.Types.ObjectId()
        );

        const savedOrders = await Order.find({ itemId: items[0]._id });
        const savedBuyer = await User.findById(buyer._id);
        const savedSeller = await User.findById(seller._id);
        const totalOrders = await Order.find({});

        expect(savedOrders.length).toBe(2);
        expect(totalOrders.length).toBe(20);
        expect(savedBuyer.balance).toBe(buyer.balance);
        expect(savedSeller.balance).toBe(seller.balance);
        expect(result).toBeNull();
    });
});

describe("deleteAllOrdersAssociatedWithUser", () => {
    it("should delete all orders associated with a particular user and update their balances if they were ordered.", async () => {
        const order = orders[0];
        const buyer = await User.findById(orders[0].buyerId);
        const seller = await User.findById(orders[0].sellerId);

        const res = await deleteAllOrdersAssociatedWithUser(users[0]._id);

        const savedOrders = await Order.find({
            $or: [{ buyerId: users[0]._id }, { sellerId: users[0]._id }],
        });
        const savedBuyer = await User.findById(buyer._id);
        const savedSeller = await User.findById(seller._id);
        const totalOrders = await Order.find({});

        expect(res.length).toBe(4);
        expect(savedOrders.length).toBe(0);
        expect(totalOrders.length).toBe(16);
        expect(savedBuyer.balance).toBe(buyer.balance);
        expect(savedSeller.balance).toBe(seller.balance);
    });

    it("should throw an error if passed id isn't valid.", async () => {
        const order = orders[0];
        const buyer = await User.findById(orders[0].buyerId);
        const seller = await User.findById(orders[0].sellerId);

        let errorMessage;
        try {
            await deleteAllOrdersAssociatedWithUser(-5);
        } catch (ex) {
            errorMessage = ex.message;
        }

        const savedOrders = await Order.find({
            $or: [{ buyerId: users[0]._id }, { sellerId: users[0]._id }],
        });
        const savedBuyer = await User.findById(buyer._id);
        const savedSeller = await User.findById(seller._id);
        const totalOrders = await Order.find({});

        expect(errorMessage).toBe("userId must be a valid id.");
        expect(savedOrders.length).toBe(4);
        expect(totalOrders.length).toBe(20);
        expect(savedBuyer.balance).toBe(buyer.balance);
        expect(savedSeller.balance).toBe(seller.balance);
    });

    it("should return null if passed id doesn't match any user.", async () => {
        const order = orders[0];
        const buyer = await User.findById(orders[0].buyerId);
        const seller = await User.findById(orders[0].sellerId);

        const result = await deleteAllOrdersAssociatedWithUser(
            mongoose.Types.ObjectId()
        );

        const savedOrders = await Order.find({
            $or: [{ buyerId: users[0]._id }, { sellerId: users[0]._id }],
        });
        const savedBuyer = await User.findById(buyer._id);
        const savedSeller = await User.findById(seller._id);
        const totalOrders = await Order.find({});

        expect(result).toBeNull();
        expect(savedOrders.length).toBe(4);
        expect(totalOrders.length).toBe(20);
        expect(savedBuyer.balance).toBe(buyer.balance);
        expect(savedSeller.balance).toBe(seller.balance);
    });
});

describe("deleteAllItemsAssociatedWithUser", () => {
    it("should delete all items associated with a particular user.", async () => {
        const userId = users[0]._id;

        const beforeItems = await Item.find({ sellerId: userId });
        const beforeOrders = [];
        for (let item of beforeItems) {
            (await Order.find({ itemId: item._id })).forEach((order) =>
                beforeOrders.push(order)
            );
        }

        const res = await deleteAllItemsAssociatedWithUser(userId);

        const afterItems = await Item.find({ sellerId: userId });
        const afterOrders = [];
        for (let item of afterItems) {
            (await Order.find({ itemId: item._id })).forEach((order) =>
                afterOrders.push(order)
            );
        }

        expect(res.length).toBe(1);
        expect(beforeItems.length).toBe(1);
        expect(beforeOrders.length).toBe(2);
        expect(afterItems.length).toBe(0);
        expect(afterOrders.length).toBe(0);
    });

    it("should throw an error if userId isn't valid.", async () => {
        const userId = -5;

        let errorMessage;
        try {
            const res = await deleteAllItemsAssociatedWithUser(userId);
        } catch (ex) {
            errorMessage = ex.message;
        }

        const afterItems = await Item.find({});
        const afterOrders = await Order.find({});

        expect(errorMessage).toMatch("userId must be a valid id.");
        expect(afterItems.length).toBe(10);
        expect(afterOrders.length).toBe(20);
    });

    it("should return null if userId doesn't match any user.", async () => {
        const userId = mongoose.Types.ObjectId();

        const res = await deleteAllItemsAssociatedWithUser(userId);

        const afterItems = await Item.find({});
        const afterOrders = await Order.find({});

        expect(res).toBeNull();
        expect(afterItems.length).toBe(10);
        expect(afterOrders.length).toBe(20);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});
