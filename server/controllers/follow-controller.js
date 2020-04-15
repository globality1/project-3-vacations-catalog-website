const express = require("express");
const followLogic = require("../business-logic-layer/follow-logic");
const router = express.Router();
const jwt = require("jsonwebtoken");
const jwtConfig = require("../data-access-layer/jwtConfig")


router.post("/", verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid
    jwt.verify(request.token, jwtConfig.returnSecretKey(), async (err, authData) => {
        if (err) {
            response.status(500).send(err.message)
        }
        else {
            try {
                const follow = request.body;
                const addedFollow = await followLogic.addFollowAsync(follow);
                response.status(201).json(addedFollow);
            }
            catch (err) {
                response.status(500).send(err.message);
            }
        }
    })
});

router.get("/", verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid
    jwt.verify(request.token, jwtConfig.returnSecretKey(), async (err, authData) => {
        if (err) {
            response.status(500).send(err.message)
        }
        else {
            try {
                const follows = await followLogic.getAllFollowAsync();
                response.json(follows);
            }
            catch (err) {
                response.status(500).send(err.message);
            }
        }
    })
});

router.get("/byUser/:userId", verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid
    jwt.verify(request.token, jwtConfig.returnSecretKey(), async (err, authData) => {
        if (err) {
            response.status(500).send(err.message)
        }
        else {
            try {
                const userId = +request.params.userId;
                const followsByUser = await followLogic.getAllFollowsByUserAsync(userId);
                response.json(followsByUser);
            }
            catch (err) {
                response.status(500).send(err.message);
            }
        }
    })
});

router.get("/byVacation", verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid
    jwt.verify(request.token, jwtConfig.returnSecretKey(), async (err, authData) => {
        if (err) {
            response.status(500).send(err.message)
        }
        else {
            try {
                const result = await followLogic.getAllFollowCountAsync();
                response.json(result);
            }
            catch (err) {
                response.status(500).send(err.message);
            }
        }
    })
})

router.delete("/", verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid
    jwt.verify(request.token, jwtConfig.returnSecretKey(), async (err, authData) => {
        if (err) {
            response.status(500).send(err.message)
        }
        else {
            try {
                const followToDelete = request.body;
                await followLogic.deleteFollowAsync(followToDelete);
                response.sendStatus(204);
            }
            catch (err) {
                response.status(500).send(err.message);
            }
        }
    })
});

// verify token functions, takes header from request, splits it and returns the token from the authorization header

function verifyToken(request, response, next) {

    const bearerHeader = request.headers['authorization'];
    // check if authorization is not undefined
    if (typeof bearerHeader !== 'undefined') {
        // split 'bearer <token>
        const bearer = bearerHeader.split(' ');
        // call only to token
        const bearerToken = bearer[1];
        // set request.token as token from header
        request.token = bearerToken;
        // continue
        next()
    } else {
        response.status(500).send("Unauthorized, Token is missing")
    }
}


module.exports = router;