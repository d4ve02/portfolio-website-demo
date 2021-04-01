const request = require("supertest");
const { User } = require("../../../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

let server;

setupServer = () => {
    server = require("../../../index");
};

describe("/api/auth", () => {
    describe("POST /", () => {
        let user;
        let password;
        let email;
        let token;

        beforeEach(async () => {
            setupServer();

            email = "test@gmail.com";
            password = "12345678";

            const salt = await bcrypt.genSalt(10);
            const passwordToSave = await bcrypt.hash(password, salt);

            user = new User({
                username: "Dave",
                address: "Somewhere",
                email,
                password: passwordToSave,
                isAdmin: false,
            });

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
                .post("/api/auth")
                .send({ email, password });
        };

        it("should return a valid JWT if given email and password are valid.", async () => {
            const res = await exec();

            const receivedToken = res.get("x-auth-token");
            const payload = jwt.decode(receivedToken);

            expect(res.status).toBe(200);

            expect(payload._id).toMatch(user._id.toString());
            expect(payload.isAdmin).toBe(user.isAdmin);
        });

        it("should return 404 if there's no user with this email.", async () => {
            email = "differentemail@gmail.com";

            const res = await exec();

            expect(res.status).toBe(404);
            expect(res.get("x-auth-token")).not.toBeDefined();
        });

        it("should return 400 if the password isn't right.", async () => {
            password = "wrongpassword";

            const res = await exec();

            expect(res.status).toBe(400);
            expect(res.get("x-auth-token")).not.toBeDefined();
        });

        it("should return 400 if the data submitted isn't valid.", async () => {
            email = "";

            const res = await exec();

            expect(res.status).toBe(400);
            expect(res.get("x-auth-token")).not.toBeDefined();
        });
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});
