const express = require("express");
const usersLogic = require("../business-logic-layer/users-logic");
const router = express.Router();


router.get("/", async (request, response) => {
    try {
        const users = await usersLogic.getAllUsersAsync();
        response.json(users);
    }
    catch(err) {
        response.status(500).send(err.message);
    }
});

router.get("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const user = await usersLogic.getOneUserAsync(id);

        if(!user) {
            response.sendStatus(404);
            return;
        }

        response.json(user);
    }
    catch(err) {
        response.status(500).send(err.message);
    }
});


router.post("/", async (request, response) => {
    try {
        const user = request.body;
        if (!user.password || !user.username) {
            const message =  {
                success: false,
                message: "Missing Username/Password",
            };
            response.status(403).send(message.message);
            return  
        }
        const addedUser = await usersLogic.addUserAsync(user);
        (addedUser.success) ? response.status(201).json(addedUser.user) : response.status(403).send(addedUser.message);
    }
    catch(err) {
        response.status(500).send(err.message);
    }
});

router.put("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const user = request.body;
        user.id = id;
        const updatedUser = await usersLogic.updateFullUserAsync(user);
        
        if(updatedUser === null) {
            response.sendStatus(404);
            return;
        }
        
        response.json(updatedUser);
    }
    catch(err) {
        response.status(500).send(err.message);
    }
});

router.patch("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const user = request.body;
        user.id = id;
        const updatedUser = await usersLogic.updatePartialUserAsync(user);
        
        if(updatedUser === null) {
            response.sendStatus(404);
            return;
        }
        
        response.json(updatedUser);
    }
    catch(err) {
        response.status(500).send(err.message);
    }
});

router.delete("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        await usersLogic.deleteUserAsync(id);
        response.sendStatus(204);
    }
    catch(err) {
        response.status(500).send(err.message);
    }
});

module.exports = router;
