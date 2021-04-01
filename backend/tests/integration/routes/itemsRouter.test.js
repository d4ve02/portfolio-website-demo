const request = require("supertest");
const { Item } = require("../../../models/itemModel");
const { User } = require("../../../models/userModel");
const mongoose = require("mongoose");
const _ = require("lodash");

let server;

const setupServer = () => {
    server = require("../../../index");
};

describe("/api/items", () => {
    let user;
    let token;

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
    });

    afterEach(async () => {
        await User.deleteMany({});
        await Item.deleteMany({});
        await new Promise((resolve, reject) => {
            server.close(resolve);
        });
    });

    describe("GET /", () => {
        let items;
        let data;

        beforeEach(async () => {
            items = [];

            items.push(
                await new Item({
                    name: "Camera",
                    rating: 5,
                    description: "A very cool camera",
                    stock: 1,
                    price: 1,
                    sellerId: user._id,
                }).save()
            );

            items.push(
                await new Item({
                    name: "Phone",
                    rating: 3,
                    description: "A phone with a camera",
                    stock: 0,
                    price: 0.01,
                    sellerId: mongoose.Types.ObjectId(),
                }).save()
            );

            items.push(
                await new Item({
                    name: "Plant",
                    rating: 3.2,
                    description: "A plant",
                    stock: 10,
                    price: 100,
                    sellerId: user._id,
                }).save()
            );

            items.push(
                await new Item({
                    name: "Bottle",
                    rating: 3,
                    description: "A cool bottle",
                    stock: 3,
                    price: 50,
                    sellerId: mongoose.Types.ObjectId(),
                }).save()
            );

            data = {};
        });

        const exec = async () => {
            return await request(server).get("/api/items").query(data);
        };

        it("should return all items if no data is passed.", async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(4);
        });

        it("should return all items associated with a seller.", async () => {
            data = { sellerId: user._id.toString() };

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
        });

        it("should return 404 if there's no user with sellerId.", async () => {
            data = { sellerId: mongoose.Types.ObjectId().toString() };
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it("should return 400 if invalid sellerId is submitted.", async () => {
            data = { sellerId: -5 };
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it("should return one item given a valid id.", async () => {
            data = { itemId: items[0]._id.toString() };

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.name).toBe(items[0].name);
        });

        it("should return 404 if there's no item with itemId.", async () => {
            data = { itemId: mongoose.Types.ObjectId().toString() };
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it("should return 400 if invalid itemId is submitted.", async () => {
            data = { itemId: -5 };
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it("should return correct items if search filter is passed.", async () => {
            data = { search: "camera" };

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
        });

        it("should return correct items if stock filter is passed.", async () => {
            data = { stock: 2 };

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
        });

        it("should return correct items if price filter is passed.", async () => {
            data = { priceMin: 40, priceMax: 60 };

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
        });

        it("should return correct items if rating filter is passed.", async () => {
            data = { rating: 3.1 };

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
        });

        it("should return 400 if data submitted isn't valid.", async () => {
            data = { rating: -5 };

            const res = await exec();

            expect(res.status).toBe(400);
        });
    });

    describe("GET /hot", () => {
        let items;

        beforeEach(async () => {
            items = [];

            items.push(
                await new Item({
                    name: "Camera",
                    rating: 5,
                    description: "A very cool camera",
                    stock: 1,
                    price: 1,
                    sellerId: user._id,
                }).save()
            );

            items.push(
                await new Item({
                    name: "Phone",
                    rating: 3,
                    description: "A phone with a camera",
                    stock: 0,
                    price: 0.01,
                    sellerId: mongoose.Types.ObjectId(),
                }).save()
            );

            items.push(
                await new Item({
                    name: "Plant",
                    rating: 3.2,
                    description: "A plant",
                    stock: 10,
                    price: 100,
                    sellerId: user._id,
                }).save()
            );

            items.push(
                await new Item({
                    name: "Bottle",
                    rating: 3,
                    description: "A cool bottle",
                    stock: 3,
                    price: 50,
                    sellerId: mongoose.Types.ObjectId(),
                }).save()
            );

            items.push(
                await new Item({
                    name: "Camera",
                    rating: 5,
                    description: "A very cool camera",
                    stock: 1,
                    price: 1,
                    sellerId: user._id,
                }).save()
            );

            items.push(
                await new Item({
                    name: "Phone",
                    rating: 3,
                    description: "A phone with a camera",
                    stock: 0,
                    price: 0.01,
                    sellerId: mongoose.Types.ObjectId(),
                }).save()
            );

            items.push(
                await new Item({
                    name: "Plant",
                    rating: 3.2,
                    description: "A plant",
                    stock: 10,
                    price: 100,
                    sellerId: user._id,
                }).save()
            );

            items.push(
                await new Item({
                    name: "Bottle",
                    rating: 3,
                    description: "A cool bottle",
                    stock: 3,
                    price: 50,
                    sellerId: mongoose.Types.ObjectId(),
                }).save()
            );

            items.push(
                await new Item({
                    name: "Camera",
                    rating: 5,
                    description: "A very cool camera",
                    stock: 1,
                    price: 1,
                    sellerId: user._id,
                }).save()
            );

            items.push(
                await new Item({
                    name: "Phone",
                    rating: 3,
                    description: "A phone with a camera",
                    stock: 0,
                    price: 0.01,
                    sellerId: mongoose.Types.ObjectId(),
                }).save()
            );

            items.push(
                await new Item({
                    name: "Plant",
                    rating: 3.2,
                    description: "A plant",
                    stock: 10,
                    price: 100,
                    sellerId: user._id,
                }).save()
            );

            items.push(
                await new Item({
                    name: "Bottle",
                    rating: 3,
                    description: "A cool bottle",
                    stock: 3,
                    price: 50,
                    sellerId: mongoose.Types.ObjectId(),
                }).save()
            );
        });

        const exec = async () => {
            return await request(server).get("/api/items/hot");
        };

        it("should return 6 unique random items.", async () => {
            const ids = [];
            let duplicate = false;

            const res = await exec();

            res.body.forEach((item) => {
                const id = item._id;
                if (ids.includes(id)) {
                    duplicate = true;
                }
                ids.push(id);
            });

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(6);
            expect(duplicate).toBe(false);
        });
    });

    describe("GET /recommended", () => {
        let items;

        beforeEach(async () => {
            items = [];

            items.push(
                await new Item({
                    name: "Camera",
                    rating: 5,
                    description: "A very cool camera",
                    stock: 1,
                    price: 1,
                    sellerId: user._id,
                }).save()
            );

            items.push(
                await new Item({
                    name: "Phone",
                    rating: 3,
                    description: "A phone with a camera",
                    stock: 0,
                    price: 0.01,
                    sellerId: mongoose.Types.ObjectId(),
                }).save()
            );

            items.push(
                await new Item({
                    name: "Plant",
                    rating: 3.2,
                    description: "A plant",
                    stock: 10,
                    price: 100,
                    sellerId: user._id,
                }).save()
            );

            items.push(
                await new Item({
                    name: "Bottle",
                    rating: 3,
                    description: "A cool bottle",
                    stock: 3,
                    price: 50,
                    sellerId: mongoose.Types.ObjectId(),
                }).save()
            );

            items.push(
                await new Item({
                    name: "Camera",
                    rating: 5,
                    description: "A very cool camera",
                    stock: 1,
                    price: 1,
                    sellerId: user._id,
                }).save()
            );

            items.push(
                await new Item({
                    name: "Phone",
                    rating: 3,
                    description: "A phone with a camera",
                    stock: 0,
                    price: 0.01,
                    sellerId: mongoose.Types.ObjectId(),
                }).save()
            );

            items.push(
                await new Item({
                    name: "Plant",
                    rating: 3.2,
                    description: "A plant",
                    stock: 10,
                    price: 100,
                    sellerId: user._id,
                }).save()
            );

            items.push(
                await new Item({
                    name: "Bottle",
                    rating: 3,
                    description: "A cool bottle",
                    stock: 3,
                    price: 50,
                    sellerId: mongoose.Types.ObjectId(),
                }).save()
            );

            items.push(
                await new Item({
                    name: "Camera",
                    rating: 5,
                    description: "A very cool camera",
                    stock: 1,
                    price: 1,
                    sellerId: user._id,
                }).save()
            );

            items.push(
                await new Item({
                    name: "Phone",
                    rating: 3,
                    description: "A phone with a camera",
                    stock: 0,
                    price: 0.01,
                    sellerId: mongoose.Types.ObjectId(),
                }).save()
            );

            items.push(
                await new Item({
                    name: "Plant",
                    rating: 3.2,
                    description: "A plant",
                    stock: 10,
                    price: 100,
                    sellerId: user._id,
                }).save()
            );

            items.push(
                await new Item({
                    name: "Bottle",
                    rating: 3,
                    description: "A cool bottle",
                    stock: 3,
                    price: 50,
                    sellerId: mongoose.Types.ObjectId(),
                }).save()
            );
        });

        const exec = async () => {
            return await request(server).get("/api/items/recommended");
        };

        it("should return 6 unique random items.", async () => {
            const ids = [];
            let duplicate = false;

            const res = await exec();

            res.body.forEach((item) => {
                const id = item._id;
                if (ids.includes(id)) {
                    duplicate = true;
                }
                ids.push(id);
            });

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(6);
            expect(duplicate).toBe(false);
        });
    });

    describe("POST /", () => {
        let data;

        beforeEach(() => {
            data = {
                name: "Item name",
                description: "A very cool item",
                stock: 3,
                price: 15.92,
                imagePath: "/images/cameraImage.jpg",
            };
        });

        const exec = async () => {
            return await request(server)
                .post("/api/items")
                .set("x-auth-token", token)
                .send(data);
        };

        it("should add an item if data submitted is valid.", async () => {
            const res = await exec();
            const saved = await Item.findOne({ name: "Item name" });

            expect(res.status).toBe(200);
            expect(saved).toMatchObject(_.omit(data, ["rating"]));
        });

        it("should return 400 if data submitted isn't valid.", async () => {
            data.name = "#";

            const res = await exec();
            const saved = await Item.findOne({ name: "Item name" });

            expect(res.status).toBe(400);
            expect(saved).toBeNull();
        });

        it("should return 400 if image path submitted isn't valid.", async () => {
            data.imagePath = "/images/nonExistingImage.jpg";

            const res = await exec();
            const saved = await Item.findOne({ name: "Item name" });

            expect(res.status).toBe(400);
            expect(saved).toBeNull();
        });
    });

    describe("PUT /", () => {
        let updateData;
        let item;

        beforeEach(async () => {
            item = new Item({
                name: "Phone",
                rating: 3,
                description: "A phone with a camera",
                stock: 0,
                price: 0.01,
                imagePath: "/images/smartphoneImage.jpg",
                sellerId: user._id,
            });

            await item.save();

            updateData = {
                _id: item._id,
                name: "Item name",
                stock: 4,
                price: 15.92,
                imagePath: "/images/pensImage.jpg",
            };
        });

        const exec = async () => {
            return await request(server)
                .put("/api/items")
                .set("x-auth-token", token)
                .send(updateData);
        };

        it("should update an item if data submitted is valid.", async () => {
            const res = await exec();
            const saved = await Item.findById(item._id);

            expect(res.status).toBe(200);
            expect(saved).toMatchObject(updateData);
            expect(res.body).toMatchObject(_.omit(updateData, "_id"));
        });

        it("should return 400 if data submitted isn't valid.", async () => {
            updateData.price = -5;

            const res = await exec();
            const saved = await Item.findOne({ _id: item._id });

            expect(res.status).toBe(400);
            expect(saved).toMatchObject(_.pick(item, ["price"]));
        });

        it("should return 404 if there's no items with given id.", async () => {
            updateData._id = mongoose.Types.ObjectId();

            const res = await exec();
            const saved = await Item.findOne({ _id: item._id });

            expect(res.status).toBe(404);
            expect(saved).toMatchObject(
                _.pick(item, ["price", "name", "description"])
            );
        });

        it("should return 403 if user id doesn't match seller id.", async () => {
            const differentUser = await new User({
                username: "Bob",
                email: "test1email@email.com",
                address: "Somewhere cool",
                password: "12345678901234567890",
                balance: 100,
                isAdmin: false,
            }).save();

            token = differentUser.generateAuthToken();

            const res = await exec();
            const saved = await Item.findOne({ _id: item._id });

            expect(res.status).toBe(403);
            expect(saved).toMatchObject(
                _.pick(item, ["price", "name", "description"])
            );
        });
    });

    describe("DELETE /", () => {
        let data;
        let item;

        beforeEach(async () => {
            item = new Item({
                name: "Phone",
                rating: 3,
                description: "A phone with a camera",
                stock: 0,
                price: 0.01,
                imagePath: "/images/smartphoneImage.jpg",
                sellerId: user._id,
            });

            await item.save();

            data = {
                _id: item._id,
            };
        });

        const exec = async () => {
            return await request(server)
                .delete("/api/items")
                .set("x-auth-token", token)
                .send(data);
        };

        it("should delete an item if data submitted is valid.", async () => {
            const res = await exec();
            const saved = await Item.findById(item._id);

            expect(res.status).toBe(200);
            expect(saved).toBeNull();
            expect(res.body.name).toBe("Phone");
        });

        it("should return 400 if data submitted isn't valid.", async () => {
            data._id = 5;

            const res = await exec();
            const saved = await Item.findOne({ _id: item._id });

            expect(res.status).toBe(400);
            expect(saved).not.toBeNull();
            expect(saved.name).toBe("Phone");
        });

        it("should return 404 if there's no items with given id.", async () => {
            data._id = mongoose.Types.ObjectId();

            const res = await exec();
            const saved = await Item.findOne({ _id: item._id });

            expect(res.status).toBe(404);
            expect(saved).toMatchObject(
                _.pick(item, ["price", "name", "description"])
            );
        });

        it("should return 403 if user id doesn't match seller id.", async () => {
            const differentUser = await new User({
                username: "Bob",
                email: "test1email@email.com",
                address: "Somewhere cool",
                password: "12345678901234567890",
                balance: 100,
                isAdmin: false,
            }).save();

            token = differentUser.generateAuthToken();

            const res = await exec();
            const saved = await Item.findOne({ _id: item._id });

            expect(res.status).toBe(403);
            expect(saved).toMatchObject(
                _.pick(item, ["price", "name", "description"])
            );
        });
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});
