require("dotenv").config();
const logger = require("../utils/logger");

module.exports = () => {
    if (!process.env.JWT_PRIVATE_KEY) {
        logger.error(
            `No JWT private key found! ${process.env.JWT_PRIVATE_KEY}`
        );
        process.exit(1);
    }
};
