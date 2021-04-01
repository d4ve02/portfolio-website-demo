const request = require("supertest");
const { User } = require("../../../models/userModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const _ = require("lodash");

let server;

const setupServer = () => {
    server = require("../../../index");
};

describe("/api/users", () => {
    describe("GET /", () => {
        let user;
        let token;

        beforeEach(async () => {
            setupServer();

            let password = "12345678";

            const salt = await bcrypt.genSalt(10);
            const passwordToSave = await bcrypt.hash(password, salt);

            const data = {
                username: "Dave",
                email: "testemail@email.com",
                address: "Somewhere cool",
                password: passwordToSave,
                balance: 100,
                isAdmin: false,
            };

            user = new User(data);
            await user.save();
            token = user.generateAuthToken();
        });

        afterEach(async () => {
            await User.deleteMany({});
            await new Promise((resolve, reject) => {
                server.close(resolve);
            });
        });

        const exec = async () => {
            return await request(server)
                .get("/api/users")
                .set("x-auth-token", token);
        };

        it("should return the user's info.", async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject(
                _.pick(user, ["address", "balance", "email", "username"])
            );
        });
    });

    describe("POST /", () => {
        let username;
        let email;
        let address;
        let password;
        let isAdmin;

        beforeEach(async () => {
            setupServer();

            username = "Dave";
            email = "test@email.com";
            address = "Somewhere";
            password = "12345678";
            isAdmin = false;
        });

        afterEach(async () => {
            await User.deleteMany({});
            await new Promise((resolve, reject) => {
                server.close(resolve);
            });
        });

        const exec = async () => {
            return await request(server).post("/api/users").send({
                username,
                email,
                address,
                password,
                isAdmin,
            });
        };

        it("should return a new user account if all data submitted is valid.", async () => {
            const res = await exec();
            const saved = await User.findOne({ email: email });

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                username,
                email,
                address,
                balance: 4000,
                isAdmin,
            });
            expect(saved).toMatchObject({
                username,
                email,
                address,
                balance: 4000,
                isAdmin,
            });
        });

        it("should return a new admin user account if all data submitted is valid.", async () => {
            isAdmin = true;
            const res = await exec();
            const saved = await User.findOne({ email: email });

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                username,
                email,
                address,
                balance: 4000,
                isAdmin,
            });
            expect(saved).toMatchObject({
                username,
                email,
                address,
                balance: 4000,
                isAdmin,
            });
        });

        it("should return 400 if the data submitted isn't valid.", async () => {
            username = "1";
            const res = await exec();
            const saved = await User.findOne({ email: email });

            expect(res.status).toBe(400);
            expect(saved).not.toBeTruthy();
        });

        it("should return 400 if there is already an account with given email.", async () => {
            await new User({
                username: "bob",
                email: "test@email.com",
                password: "12345678901234567890",
                address: "a cool address",
                balance: 0,
                isAdmin: false,
            }).save();

            const res = await exec();
            const saved = await User.findOne({ email: email });

            expect(res.status).toBe(400);
            expect(saved.username).toBe("bob");
        });

        it("should return 403 if there is already an admin.", async () => {
            await new User({
                username: "admin",
                email: "admin@email.com",
                password: "12345678901234567890",
                address: "a cool address",
                balance: 0,
                isAdmin: true,
            }).save();

            isAdmin = true;

            const res = await exec();
            const saved = await User.findOne({ email: email });

            expect(res.status).toBe(403);
            expect(saved).not.toBeTruthy();
        });
    });

    describe("PUT /", () => {
        let updateEmail;
        let password;
        let token;

        beforeEach(async () => {
            setupServer();

            updateEmail = "test1@gmail.com";
            password = "12345678";

            const salt = await bcrypt.genSalt(10);
            const passwordToSave = await bcrypt.hash("12345678", salt);

            const data = {
                username: "Dave",
                email: "test@email.com",
                address: "Somewhere cool",
                password: passwordToSave,
                balance: 100,
                isAdmin: false,
            };

            const user = new User(data);
            await user.save();
            token = user.generateAuthToken();
        });

        afterEach(async () => {
            await User.deleteMany({});
            await new Promise((resolve, reject) => {
                server.close(resolve);
            });
        });

        const exec = async () => {
            return await request(server)
                .put("/api/users/")
                .set("x-auth-token", token)
                .send({ email: updateEmail, password });
        };

        it("should update an existing user account if the given data is valid.", async () => {
            const res = await exec();
            const saved = await User.findOne({ email: updateEmail });

            expect(res.status).toBe(200);
            expect(res.body).toBeTruthy();
            expect(res.body.email).toBe(updateEmail);
            expect(saved.email).toBe(updateEmail);
        });

        it("should update an existing user account even if no password is passed.", async () => {
            password = "";
            const res = await exec();
            const saved = await User.findOne({ email: updateEmail });

            expect(res.status).toBe(200);
            expect(res.body).toBeTruthy();
            expect(res.body.email).toBe(updateEmail);
            expect(saved.email).toBe(updateEmail);
        });

        it("should return 400 if the data submitted isn't valid.", async () => {
            updateEmail = "---";
            const res = await exec();
            const saved = await User.findOne({ email: updateEmail });

            expect(res.status).toBe(400);
            expect(saved).toBeNull();
        });
    });

    describe("DELETE /", () => {
        let user;
        let admin;
        let token;
        let id;

        beforeEach(async () => {
            setupServer();

            const data = {
                username: "Dave",
                email: "testemail@email.com",
                address: "Somewhere cool",
                password: "12345678901234567890",
                balance: 100,
                isAdmin: false,
            };

            user = new User(data);
            await user.save();

            id = user._id;

            const adminData = {
                username: "admin",
                email: "admin@email.com",
                address: "Somewhere admin cool",
                password: "12345678901234567890",
                balance: 200,
                isAdmin: true,
            };

            admin = new User(adminData);
            await admin.save();

            token = admin.generateAuthToken();
        });

        afterEach(async () => {
            await User.deleteMany({});
            await new Promise((resolve, reject) => {
                server.close(resolve);
            });
        });

        const exec = async () => {
            return await request(server)
                .delete("/api/users/")
                .set("x-auth-token", token)
                .send({ _id: id });
        };

        it("should delete a user as an admin.", async () => {
            const res = await exec();
            const saved = await User.findOne({ _id: user._id });

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject(
                _.pick(user, ["address", "balance", "email", "username"])
            );
            expect(saved).toBeNull();
        });

        it("should return 400 if no id was submitted.", async () => {
            id = "";

            const res = await exec();
            const saved = await User.findOne({ _id: user._id });

            expect(res.status).toBe(400);
            expect(saved).toBeTruthy();
        });

        it("should return 400 if submitted id isn't valid.", async () => {
            id = "hahahahaha";

            const res = await exec();
            const saved = await User.findOne({ _id: user._id });

            expect(res.status).toBe(400);
            expect(saved).toBeTruthy();
        });

        it("should return 404 if submitted id doesn't match any user.", async () => {
            id = mongoose.Types.ObjectId();

            const res = await exec();
            const saved = await User.findOne({ _id: user._id });

            expect(res.status).toBe(404);
            expect(saved).toBeTruthy();
        });
    });

    describe("DELETE /my-account", () => {
        let user;
        let token;

        beforeEach(async () => {
            setupServer();

            const data = {
                username: "Dave",
                email: "testemail@email.com",
                address: "Somewhere cool",
                password: "12345678901234567890",
                balance: 100,
                isAdmin: false,
            };

            user = new User(data);
            await user.save();

            token = user.generateAuthToken();
        });

        afterEach(async () => {
            await User.deleteMany({});
            await new Promise((resolve, reject) => {
                server.close(resolve);
            });
        });

        const exec = async () => {
            return await request(server)
                .delete("/api/users/my-account")
                .set("x-auth-token", token);
        };

        it("should delete a user.", async () => {
            const res = await exec();
            const saved = await User.findOne({ _id: user._id });

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject(
                _.pick(user, ["address", "balance", "email", "username"])
            );
            expect(saved).toBeNull();
        });
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});
