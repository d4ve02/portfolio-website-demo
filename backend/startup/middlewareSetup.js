const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const logger = require("../utils/logger");

const corsOptions = {
    exposedHeaders: "x-auth-token",
};

const checkHttps = (req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
        res.redirect(`https://${req.header("host")}${req.url}`);
    } else next();
};

module.exports = (app) => {
    if (process.env.NODE_ENV === "production") {
        logger.info("Server is using HTTPS only connections.");
        app.use(checkHttps);
    }
    app.use(cors(corsOptions));
    app.use(helmet());
    app.use(compression());
};
