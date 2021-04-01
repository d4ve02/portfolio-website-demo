const addErrorHandler = require("../../middleware/errorHandler");
const isAdmin = require("../../middleware/isAdmin");
const errorHandlingSetup = require("../../startup/errorHandlingSetup");

const data = {
    status: 0,
    message: "",
};

const res = {
    status: (number) => {
        data.status = number;

        return {
            send: (message) => {
                data.message = message;
            },
        };
    },
};

const req = {
    user: {},
};

describe("errorHandler", () => {
    const handler = async (req, res) => {
        throw new Error();
    };

    it('should return a 500 response with a "Something failed" message.', async () => {
        await addErrorHandler(handler)(null, res, () => {});

        expect(data.status).toBe(500);
        expect(data.message).toBe("Something failed.");
    });
});

describe("isAdmin", () => {
    it('should return a 403 response with a "Something failed" message.', async () => {
        await isAdmin(req, res, () => {});

        expect(data.status).toBe(403);
        expect(data.message).toBe("403. Forbidden.");
    });
});

describe("errorHandlingSetup", () => {
    it(`should return a 500 response with a "Something failed" message.`, async () => {
        errorHandlingSetup({
            use: (handler) => {
                handler(
                    {
                        stack: "Whoops something went wrong",
                    },
                    req,
                    res,
                    () => {}
                );
            },
        });

        expect(data.status).toBe(500);
        expect(data.message).toBe("Something failed.");
    });
});
