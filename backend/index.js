const { info } = require("./utils/logger");
const express = require("express");
const databaseCleaner = require("./startup/databaseCleaner");
const app = express();
app.use(express.json());

require("./startup/envSetup")();
require("./startup/dbSetup").connect(app);
require("./startup/middlewareSetup")(app);
require("./startup/routingSetup")(app);
require("./startup/errorHandlingSetup")(app);

const port = process.env.PORT ? process.env.PORT : 5000;

const server = app.listen(port, () => {
    info(`Listening on port ${port}...`);
});

if (process.env.NODE_ENV !== "test") {
    databaseCleaner(server);
}

module.exports = server;
