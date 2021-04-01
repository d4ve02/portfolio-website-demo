router = require("express").Router();
const handleErrors = require("../middleware/errorHandler");
const imagesAvailable = require("../utils/imagePaths");

router.get(
    "/",
    handleErrors(async (req, res) => {
        res.send(imagesAvailable);
    })
);

module.exports = router;
