const request = require("supertest");
const mongoose = require("mongoose");
const _ = require("lodash");
const { Order } = require("../../../models/orderModel");
const { Item } = require("../../../models/itemModel");
const { User } = require("../../../models/userModel");
const statuses = require("../../../utils/statuses");

let server;
const setupServer = () => {
    server = require("../../../index");
};

describe("/api/orders", () => {
    let user;
    let token;

    let sellers = [];
    let items = [];
    let orders = [];

    beforeEach(async () => {
        setupServer();

        user = new User({
            username: "Dave",
            email: "testemail@email.com",
            address: "Somewhere cool",
            password: "12345678901234567890",
            balance: 100,
            isAdmin: false,
        });

        await user.save();
        token = user.generateAuthToken();

        for (let i = 0; i < 10; i++) {
            sellers.push(
                await new User({
                    username: `Dave`,
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
                    description: `A very cool camera nr.${i}`,
                    stock: 1,
                    price: 100,
                    sellerId: sellers[i],
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

        sellers = [];
        items = [];
        orders = [];
    });

    describe("GET /cart", () => {
        beforeEach(async () => {
            for (let i = 0; i < 10; i++) {
                orders.push(
                    await new Order({
                        buyerId: user._id,
                        sellerId: sellers[i],
                        itemId: items[i],
                        total: items[i].price,
                        status: "cart",
                    }).save()
                );
                orders.push(
                    await new Order({
                        buyerId: user._id,
                        sellerId: sellers[i],
                        itemId: items[i],
                        total: items[i].price,
                        status: "ordered",
                    }).save()
                );
                orders.push(
                    await new Order({
                        buyerId: user._id,
                        sellerId: sellers[i],
                        itemId: items[i],
                        total: items[i].price,
                        status: "completed",
                    }).save()
                );
                orders.push(
                    await new Order({
                        buyerId: user._id,
                        sellerId: sellers[i],
                        itemId: items[i],
                        total: items[i].price,
                        status: "canceled",
                    }).save()
                );
            }
        });

        const exec = async () => {
            return await request(server)
                .get("/api/orders/cart")
                .set("x-auth-token", token);
        };

        it("should return all items with appropriate buyerId and cart status.", async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(10);
            expect(res.body[0].buyerId.toString()).toBe(user._id.toString());
        });
    });

    describe("GET /ordered", () => {
        beforeEach(async () => {
            for (let i = 0; i < 10; i++) {
                orders.push(
                    await new Order({
                        buyerId: user._id,
                        sellerId: sellers[i],
                        itemId: items[i],
                        total: items[i].price,
                        status: "cart",
                    }).save()
                );
                orders.push(
                    await new Order({
                        buyerId: user._id,
                        sellerId: sellers[i],
                        itemId: items[i],
                        total: items[i].price,
                        status: "ordered",
                    }).save()
                );
                orders.push(
                    await new Order({
                        buyerId: user._id,
                        sellerId: sellers[i],
                        itemId: items[i],
                        total: items[i].price,
                        status: "completed",
                    }).save()
                );
                orders.push(
                    await new Order({
                        buyerId: user._id,
                        sellerId: sellers[i],
                        itemId: items[i],
                        total: items[i].price,
                        status: "canceled",
                    }).save()
                );
            }
        });

        const exec = async () => {
            return await request(server)
                .get("/api/orders/ordered")
                .set("x-auth-token", token);
        };

        it("should return all items with appropriate buyerId and ordered status.", async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(30);
            expect(res.body[0].buyerId.toString()).toBe(user._id.toString());
        });
    });

    describe("GET /sold", () => {
        beforeEach(async () => {
            for (let i = 0; i < 10; i++) {
                orders.push(
                    await new Order({
                        buyerId: sellers[i],
                        sellerId: user._id,
                        itemId: items[i],
                        total: items[i].price,
                        status: _.sample(statuses),
                    }).save()
                );
            }
            for (let i = 0; i < 9; i++) {
                orders.push(
                    await new Order({
                        buyerId: user._id,
                        sellerId: sellers[i],
                        itemId: items[i],
                        total: items[i].price,
                        status: _.sample(statuses),
                    }).save()
                );
            }
        });

        const exec = async () => {
            return await request(server)
                .get("/api/orders/sold")
                .set("x-auth-token", token);
        };

        it("should return all items sold by user.", async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(10);
            expect(res.body[0].sellerId.toString()).toBe(user._id.toString());
        });
    });

    describe("POST /", () => {
        let item;
        let itemId;

        beforeEach(() => {
            item = items[0];
            itemId = item._id;
        });

        const exec = async () => {
            return await request(server)
                .post("/api/orders/")
                .set("x-auth-token", token)
                .send({ itemId });
        };

        it("should order an item.", async () => {
            const res = await exec();
            const saved = await Order.findOne({ buyerId: user._id });

            expect(res.status).toBe(200);
            expect(res.body.buyerId.toString()).toBe(user._id.toString());
            expect(res.body.sellerId.toString()).toBe(
                sellers[0]._id.toString()
            );
            expect(saved).toMatchObject({
                buyerId: user._id,
                sellerId: item.sellerId,
                itemId: item._id,
                total: item.price,
                status: "cart",
            });
        });

        it("should return 400 if invalid id is submitted.", async () => {
            itemId = -5;

            const res = await exec();
            const saved = await Order.findOne({ buyerId: user._id });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({});
            expect(saved).toBeNull();
        });

        it("should return 400 if seller tried to buy his own product.", async () => {
            token = (await User.findById(item.sellerId)).generateAuthToken();

            const res = await exec();
            const saved = await Order.findOne({ buyerId: item.sellerId });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({});
            expect(saved).toBeNull();
        });

        it("should return 404 if there's no item with given id.", async () => {
            itemId = mongoose.Types.ObjectId();

            const res = await exec();
            const saved = await Order.findOne({ buyerId: user._id });

            expect(res.status).toBe(404);
            expect(res.body).toEqual({});
            expect(saved).toBeNull();
        });
    });

    describe("PUT /ordered", () => {
        let order;
        let buyer;
        let seller;
        let item;
        let orderId;

        beforeEach(async () => {
            item = items[0];
            buyer = user;
            seller = sellers[0];

            order = await new Order({
                buyerId: user._id,
                sellerId: seller._id,
                itemId: item._id,
                total: item.price,
                status: "cart",
            }).save();

            orderId = order._id;
        });

        const exec = async () => {
            return await request(server)
                .put("/api/orders/ordered")
                .set("x-auth-token", token)
                .send({ orderId });
        };

        it("should place an order if all data is valid and update balances.", async () => {
            const res = await exec();
            const saved = await Order.findById(order._id);

            const updatedBuyer = await User.findById(user._id);
            const updatedSeller = await User.findById(seller._id);

            expect(res.status).toBe(200);
            expect(res.body.status).toMatch(saved.status);
            expect(res.body.status).toMatch("ordered");
            expect(updatedBuyer.balance).toBe(buyer.balance - order.total);
            expect(updatedSeller.balance).toBe(seller.balance + order.total);
        });

        it("should return 400 if submitted id isn't valid.", async () => {
            orderId = -5;

            const res = await exec();
            const saved = await Order.findById(order._id);

            const updatedBuyer = await User.findById(user._id);
            const updatedSeller = await User.findById(seller._id);

            expect(res.status).toBe(400);
            expect(saved.status).toMatch("cart");
            expect(updatedBuyer.balance).toBe(buyer.balance);
            expect(updatedSeller.balance).toBe(seller.balance);
        });

        it("should return 404 if submitted id doesn't match any order.", async () => {
            orderId = mongoose.Types.ObjectId();

            const res = await exec();
            const saved = await Order.findById(order._id);

            const updatedBuyer = await User.findById(user._id);
            const updatedSeller = await User.findById(seller._id);

            expect(res.status).toBe(404);
            expect(saved.status).toMatch("cart");
            expect(updatedBuyer.balance).toBe(buyer.balance);
            expect(updatedSeller.balance).toBe(seller.balance);
        });

        it("should return 400 if order isn't in cart.", async () => {
            order = await new Order({
                buyerId: user._id,
                sellerId: seller._id,
                itemId: item._id,
                total: item.price,
                status: "canceled",
            }).save();
            orderId = order._id;

            const res = await exec();
            const saved = await Order.findById(order._id);

            const updatedBuyer = await User.findById(user._id);
            const updatedSeller = await User.findById(seller._id);

            expect(res.status).toBe(400);
            expect(saved.status).toMatch("canceled");
            expect(updatedBuyer.balance).toBe(buyer.balance);
            expect(updatedSeller.balance).toBe(seller.balance);
        });

        it("should return 403 if user doesn't match buyer.", async () => {
            order = await new Order({
                buyerId: mongoose.Types.ObjectId(),
                sellerId: seller._id,
                itemId: item._id,
                total: item.price,
                status: "cart",
            }).save();
            orderId = order._id;

            const res = await exec();
            const saved = await Order.findById(order._id);

            const updatedBuyer = await User.findById(user._id);
            const updatedSeller = await User.findById(seller._id);

            expect(res.status).toBe(403);
            expect(saved.status).toMatch("cart");
            expect(updatedBuyer.balance).toBe(buyer.balance);
            expect(updatedSeller.balance).toBe(seller.balance);
        });

        it("should return 400 if user doesn't have enough money.", async () => {
            await User.findByIdAndUpdate(buyer._id, { balance: 5 });

            const res = await exec();
            const saved = await Order.findById(order._id);

            const updatedBuyer = await User.findById(user._id);
            const updatedSeller = await User.findById(seller._id);

            expect(res.status).toBe(400);
            expect(saved.status).toMatch("cart");
            expect(updatedBuyer.balance).toBe(5);
            expect(updatedSeller.balance).toBe(seller.balance);
        });
    });

    describe("PUT /canceled", () => {
        let order;
        let buyer;
        let seller;
        let item;
        let orderId;

        beforeEach(async () => {
            item = items[0];
            buyer = user;
            seller = sellers[0];

            order = await new Order({
                buyerId: user._id,
                sellerId: seller._id,
                itemId: item._id,
                total: item.price,
                status: "ordered",
            }).save();

            orderId = order._id;
        });

        const exec = async () => {
            return await request(server)
                .put("/api/orders/canceled")
                .set("x-auth-token", token)
                .send({ orderId });
        };

        it("should cancel an order if all data is valid and update balances.", async () => {
            const res = await exec();
            const saved = await Order.findById(order._id);

            const updatedBuyer = await User.findById(user._id);
            const updatedSeller = await User.findById(seller._id);

            expect(res.status).toBe(200);
            expect(res.body.status).toMatch(saved.status);
            expect(res.body.status).toMatch("canceled");
            expect(updatedBuyer.balance).toBe(buyer.balance + order.total);
            expect(updatedSeller.balance).toBe(seller.balance - order.total);
        });

        it("should cancel an order on seller's request if all data is valid and update balances.", async () => {
            token = seller.generateAuthToken();

            const res = await exec();
            const saved = await Order.findById(order._id);

            const updatedBuyer = await User.findById(user._id);
            const updatedSeller = await User.findById(seller._id);

            expect(res.status).toBe(200);
            expect(res.body.status).toMatch(saved.status);
            expect(res.body.status).toMatch("canceled");
            expect(updatedBuyer.balance).toBe(buyer.balance + order.total);
            expect(updatedSeller.balance).toBe(seller.balance - order.total);
        });

        it("should return 400 if submitted id isn't valid.", async () => {
            orderId = -5;

            const res = await exec();
            const saved = await Order.findById(order._id);

            const updatedBuyer = await User.findById(user._id);
            const updatedSeller = await User.findById(seller._id);

            expect(res.status).toBe(400);
            expect(saved.status).toMatch("ordered");
            expect(updatedBuyer.balance).toBe(buyer.balance);
            expect(updatedSeller.balance).toBe(seller.balance);
        });

        it("should return 404 if submitted id doesn't match any order.", async () => {
            orderId = mongoose.Types.ObjectId();

            const res = await exec();
            const saved = await Order.findById(order._id);

            const updatedBuyer = await User.findById(user._id);
            const updatedSeller = await User.findById(seller._id);

            expect(res.status).toBe(404);
            expect(saved.status).toMatch("ordered");
            expect(updatedBuyer.balance).toBe(buyer.balance);
            expect(updatedSeller.balance).toBe(seller.balance);
        });

        it("should return 400 if order isn't ordered.", async () => {
            order = await new Order({
                buyerId: user._id,
                sellerId: seller._id,
                itemId: item._id,
                total: item.price,
                status: "completed",
            }).save();
            orderId = order._id;

            const res = await exec();
            const saved = await Order.findById(order._id);

            const updatedBuyer = await User.findById(user._id);
            const updatedSeller = await User.findById(seller._id);

            expect(res.status).toBe(400);
            expect(saved.status).toMatch("completed");
            expect(updatedBuyer.balance).toBe(buyer.balance);
            expect(updatedSeller.balance).toBe(seller.balance);
        });

        it("should return 403 if user doesn't match buyer.", async () => {
            order = await new Order({
                buyerId: mongoose.Types.ObjectId(),
                sellerId: seller._id,
                itemId: item._id,
                total: item.price,
                status: "ordered",
            }).save();
            orderId = order._id;

            const res = await exec();
            const saved = await Order.findById(order._id);

            const updatedBuyer = await User.findById(user._id);
            const updatedSeller = await User.findById(seller._id);

            expect(res.status).toBe(403);
            expect(saved.status).toMatch("ordered");
            expect(updatedBuyer.balance).toBe(buyer.balance);
            expect(updatedSeller.balance).toBe(seller.balance);
        });
    });

    describe("PUT /completed", () => {
        let order;
        let seller;
        let item;
        let orderId;

        beforeEach(async () => {
            item = items[0];
            seller = sellers[0];

            order = await new Order({
                buyerId: user._id,
                sellerId: seller._id,
                itemId: item._id,
                total: item.price,
                status: "ordered",
            }).save();

            orderId = order._id;
        });

        const exec = async () => {
            return await request(server)
                .put("/api/orders/completed")
                .set("x-auth-token", token)
                .send({ orderId });
        };

        it("should complete an order if all data is valid.", async () => {
            const res = await exec();
            const saved = await Order.findById(order._id);

            expect(res.status).toBe(200);
            expect(res.body.status).toMatch(saved.status);
            expect(res.body.status).toMatch("completed");
        });

        it("should return 400 if submitted id isn't valid.", async () => {
            orderId = -5;

            const res = await exec();
            const saved = await Order.findById(order._id);

            expect(res.status).toBe(400);
            expect(saved.status).toMatch("ordered");
        });

        it("should return 404 if submitted id doesn't match any order.", async () => {
            orderId = mongoose.Types.ObjectId();

            const res = await exec();
            const saved = await Order.findById(order._id);

            expect(res.status).toBe(404);
            expect(saved.status).toMatch("ordered");
        });

        it("should return 400 if order isn't ordered.", async () => {
            order = await new Order({
                buyerId: user._id,
                sellerId: seller._id,
                itemId: item._id,
                total: item.price,
                status: "canceled",
            }).save();
            orderId = order._id;

            const res = await exec();
            const saved = await Order.findById(order._id);

            expect(res.status).toBe(400);
            expect(saved.status).toMatch("canceled");
        });

        it("should return 403 if user doesn't match buyer.", async () => {
            order = await new Order({
                buyerId: mongoose.Types.ObjectId(),
                sellerId: seller._id,
                itemId: item._id,
                total: item.price,
                status: "ordered",
            }).save();
            orderId = order._id;

            const res = await exec();
            const saved = await Order.findById(order._id);

            expect(res.status).toBe(403);
            expect(saved.status).toMatch("ordered");
        });
    });

    describe("DELETE /", () => {
        let order;
        let seller;
        let item;
        let orderId;

        beforeEach(async () => {
            item = items[0];
            seller = sellers[0];

            order = await new Order({
                buyerId: user._id,
                sellerId: seller._id,
                itemId: item._id,
                total: item.price,
                status: "cart",
            }).save();
            orderId = order._id;
        });

        const exec = async () => {
            return await request(server)
                .delete("/api/orders/")
                .set("x-auth-token", token)
                .send({ orderId });
        };

        it("should delete an order if all data is valid.", async () => {
            const res = await exec();
            const saved = await Order.findById(order._id);

            expect(res.status).toBe(200);
            expect(saved).toBeNull();
        });

        it("should return 400 if submitted id isn't valid.", async () => {
            orderId = -5;

            const res = await exec();
            const saved = await Order.findById(order._id);

            expect(res.status).toBe(400);
            expect(saved.status).toMatch("cart");
        });

        it("should return 404 if submitted id doesn't match any order.", async () => {
            orderId = mongoose.Types.ObjectId();

            const res = await exec();
            const saved = await Order.findById(order._id);

            expect(res.status).toBe(404);
            expect(saved.status).toMatch("cart");
        });

        it("should return 400 if order isn't in the cart.", async () => {
            order = await new Order({
                buyerId: user._id,
                sellerId: seller._id,
                itemId: item._id,
                total: item.price,
                status: "canceled",
            }).save();
            orderId = order._id;

            const res = await exec();
            const saved = await Order.findById(order._id);

            expect(res.status).toBe(400);
            expect(saved.status).toMatch("canceled");
        });

        it("should return 403 if user doesn't match buyer.", async () => {
            order = await new Order({
                buyerId: mongoose.Types.ObjectId(),
                sellerId: seller._id,
                itemId: item._id,
                total: item.price,
                status: "cart",
            }).save();
            orderId = order._id;

            const res = await exec();
            const saved = await Order.findById(order._id);

            expect(res.status).toBe(403);
            expect(saved.status).toMatch("cart");
        });
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});
