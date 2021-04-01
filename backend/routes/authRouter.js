router = require("express").Router();
const logger = require("../utils/logger");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const { User, validateUserLoginCredentials } = require("../models/userModel");

router.post("/", async (req, res) => {
    const data = _.pick(req.body, ["email", "password"]);

    const validate = validateUserLoginCredentials(data);
    if (validate) {
        return res
            .status(400)
            .send(`The data you submitted isn't valid: ${validate.message}`);
    }

    const user = await User.findOne({ email: data.email });
    if (!user) {
        return res.status(404).send(`Invalid email or password.`);
    }

    const matchingPasswords = await bcrypt.compare(
        data.password,
        user.password
    );
    if (!matchingPasswords) {
        return res.status(400).send(`Invalid email or password.`);
    }

    const token = user.generateAuthToken();

    logger.info("Authenticated user.");
    res.set({ "x-auth-token": token }).send(
        `Logged in successfully as ${user.username}`
    );
});

module.exports = router;
