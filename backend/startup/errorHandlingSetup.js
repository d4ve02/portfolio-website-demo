const { error } = require("../utils/logger");

module.exports = (app) => {
    app.use(function (err, req, res, next) {
        error(err.stack);
        res.status(500).send("Something failed.");
    });
};
