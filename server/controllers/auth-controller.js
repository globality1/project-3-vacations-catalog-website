const express = require("express");
const authLogic = require("../business-logic-layer/auth-logic");
const router = express.Router();


router.post("/login", async (request, response) => {
    try {
        const { username, password } = request.body;
        const result = await authLogic.validateUser(username, password);
        const user = result.userInfo;
        if (result.success) {
            user.token = result.token;
            request.session.isLoggedIn = true;
            request.session.userRole = result.userRole; 
        }
        (result.success) ? response.json({user}) : response.status(403).send(result.message);

    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

router.post("/logout", async (request, response) => {
    request.session.destroy();
    response.send();
});


module.exports = router;