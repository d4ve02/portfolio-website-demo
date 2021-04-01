const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const isAuthenticated = require("../../middleware/isAuthenticated");
const { User } = require("../../models/userModel");

let server;
let user;
let token;
let payload;

beforeEach(async () => {
    server = require("../../index");

    user = await new User({
        username: `User`,
        email: `seller@email.com`,
        address: `Seller address`,
        password: `12345678901234567890`,
        balance: 200,
        isAdmin: false,
    }).save();

    token = user.generateAuthToken();

    payload = {
        _id: user._id.toString(),
        isAdmin: false,
    };
});

afterEach(async () => {
    await User.deleteMany({});
    await new Promise((resolve, reject) => {
        server.close(resolve);
    });
});

describe("isAuthenticated", () => {
    let res;
    let req;
    let res_data;
    let req_data;

    beforeEach(() => {
        res_data = {
            status: 200,
            message: "",
        };

        req_data = {
            headers: {
                "x-auth-token": token,
            },
        };

        res = {
            status: (number) => {
                res_data.status = number;

                return {
                    send: (message) => {
                        res_data.message = message;
                    },
                };
            },
        };

        req = {
            header: (property) => {
                return req_data.headers[property];
            },
        };
    });

    it("should populate the req payload correctly", async () => {
        await isAuthenticated(req, res, () => {});

        expect(res_data.status).toBe(200);
        expect(req.user).toMatchObject(payload);
    });

    it("should return 401 if no token is provided", async () => {
        req_data.headers = {};

        await isAuthenticated(req, res, () => {});

        expect(res_data.status).toBe(401);
        expect(req.user).not.toBeDefined();
    });

    it("should return 401 if invalid structure token is provided", async () => {
        req_data.headers = {
            "x-auth-token": -5,
        };

        await isAuthenticated(req, res, () => {});

        expect(res_data.status).toBe(401);
        expect(req.user).not.toBeDefined();
    });

    it("should return 401 if invalid content token is provided", async () => {
        req_data.headers = {
            "x-auth-token": "test",
        };

        await isAuthenticated(req, res, () => {});

        expect(res_data.status).toBe(401);
        expect(req.user).not.toBeDefined();
    });

    it("should return 404 if payload doesn't match any user.", async () => {
        req_data.headers = {
            "x-auth-token": jwt.sign({}, process.env.JWT_PRIVATE_KEY),
        };

        await isAuthenticated(req, res, () => {});

        expect(res_data.status).toBe(404);
        expect(req.user).not.toBeDefined();
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});
