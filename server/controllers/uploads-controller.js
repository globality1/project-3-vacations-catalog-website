const express = require("express");
const router = express.Router();


router.get("/:imgName", async (request, response) => {
    try {
        response.sendFile(request.params.imgName,  { root: "./uploads" });
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

module.exports = router;