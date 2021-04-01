const logger = require("../utils/logger");

module.exports = function addErrorHandler(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
            next();
        } catch (ex) {
            logger.error(ex);
            res.status(500).send("Something failed.");
        }
    };
};
