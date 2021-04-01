const request = require("supertest");
const imagesAvailable = require("../../../utils/imagePaths");
const mongoose = require("mongoose");

let server;

const setupServer = () => {
    server = require("../../../index");
};

describe("/api/images", () => {
    beforeEach(() => {
        setupServer();
    });

    afterEach(async () => {
        await new Promise((resolve, reject) => {
            server.close(resolve);
        });
    });

    const exec = async () => {
        return await request(server).get("/api/images");
    };

    describe("GET /", () => {
        it("should return the available images and their paths.", async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toStrictEqual(imagesAvailable);
        });
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});
