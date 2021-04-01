const mongoose = require("mongoose");
const logger = require("../utils/logger");

let db = process.env.DB;
if (process.env.NODE_ENV === "test") {
    db = process.env.DB_TEST;
}

const connect = () => {
    mongoose
        .connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        })
        .then(() => logger.info("Connected sucessfully to mongoDB server."))
        .catch((error) => {
            logger.error("Failed connecting to mongoDB server, aborting.");
            process.exit(1);
        });
};

module.exports = { connect, db };
