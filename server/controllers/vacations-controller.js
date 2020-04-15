const express = require("express");
const vacationsLogic = require("../business-logic-layer/vacations-logic");
const router = express.Router();
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../data-access-layer/jwtConfig")

router.get("/", verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid
    jwt.verify(request.token, jwtConfig.returnSecretKey(), async (err, authData) => {
        if (err) {
            response.status(500).send(err.message)
        }
        else {
            try {
                const vacations = await vacationsLogic.getAllVacationsAsync();
                response.json(vacations);
            }
            catch (err) {
                response.status(500).send(err.message);
            }
        }
    })
});

router.get("/:id", verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid
    jwt.verify(request.token, jwtConfig.returnSecretKey(), async (err, authData) => {
        if (err) {
            response.status(500).send(err.message)
        }
        else {
            try {
                const id = +request.params.id;
                const vacation = await vacationsLogic.getOneVacationAsync(id);

                if (!vacation) {
                    response.sendStatus(404);
                    return;
                }

                response.json(vacation);
            }
            catch (err) {
                response.status(500).send(err.message);
            }
        }
    })
});

router.post("/", verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid
    jwt.verify(request.token, jwtConfig.returnSecretKey(), async (err, authData) => {
        if (err) {
            response.status(500).send(err.message)
        }
        else {
            try {
                const vacation = request.body;
                const uploadFile = request.files.imageFile;
                const extension = uploadFile.name.substr(uploadFile.name.lastIndexOf("."));
                const fileName = uuid.v4() + extension;
                uploadFile.mv("./uploads/" + fileName);
                const addedVacation = await vacationsLogic.addVacationAsync(vacation, fileName);
                response.status(201).json(addedVacation);
            }
            catch (err) {
                response.status(500).send(err.message);
            }
        }
    })
});

router.put("/:id", verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid
    jwt.verify(request.token, jwtConfig.returnSecretKey(), async (err, authData) => {
        if (err) {
            response.status(500).send(err.message)
        }
        else {
            try {
                const id = +request.params.id;
                const vacation = request.body;
                vacation.id = id;
                const uploadFile = request.files.imageFile;
                const extension = uploadFile.name.substr(uploadFile.name.lastIndexOf("."));
                const fileName = uuid.v4() + extension;
                uploadFile.mv("./uploads/" + fileName);
                const updatedVacation = await vacationsLogic.updateFullVacationAsync(vacation, fileName);

                if (updatedVacation === null) {
                    response.sendStatus(404);
                    return;
                }

                response.json(updatedVacation);
            }
            catch (err) {
                response.status(500).send(err.message);
            }
        }
    })
});

router.patch("/:id", verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid
    jwt.verify(request.token, jwtConfig.returnSecretKey(), async (err, authData) => {
        if (err) {
            response.status(500).send(err.message)
        }
        else {
            try {
                const id = +request.params.id;
                const vacation = request.body;
                vacation.id = id;
                const uploadFile = request.files.imageFile;
                const extension = uploadFile.name.substr(uploadFile.name.lastIndexOf("."));
                const fileName = uuid.v4() + extension;
                uploadFile.mv("./uploads/" + fileName);
                const updatedVacation = await vacationsLogic.updatePartialVacationAsync(vacation, fileName);

                if (updatedVacation === null) {
                    response.sendStatus(404);
                    return;
                }

                response.json(updatedVacation);
            }
            catch (err) {
                response.status(500).send(err.message);
            }
        }
    })
});

router.delete("/:id", verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid   
    jwt.verify(request.token, jwtConfig.returnSecretKey(), async (err, authData) => {
        if (err) {
            response.status(500).send(err.message)
        }
        else {
            try {
                const id = +request.params.id;
                await vacationsLogic.deleteVacationAsync(id);
                response.sendStatus(204);
            }
            catch (err) {
                response.status(500).send(err.message);
            }
        }
    })
});


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
