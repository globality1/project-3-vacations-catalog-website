const express = require("express");
const usersController = require("./controllers/users-controller");
const vacationsController = require("./controllers/vacations-controller");
const followController = require("./controllers/follow-controller");
const authController = require("./controllers/auth-controller");
const uploadsController = require("./controllers/uploads-controller");
const vacationsLogic = require("./business-logic-layer/vacations-logic");
const expressSession = require("express-session");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const server = express();
const cors = require("cors");
const io = require("socket.io");


server.use(cors({ origin: "http://localhost:3001", credentials: true }));
server.use(express.json());
server.use(fileUpload());

server.use(expressSession({
    name: "vacationProjectJB", // session key, where the value is the session id.
    secret: "1S12ASwsdf", // Encryption key
    resave: true, // Start counting session time from scratch on each request.
    saveUninitialized: false // Don't create a session for request which doesn't need a session
}));

server.use("/api/auth", authController);
server.use("/api/users", usersController);
server.use("/api/vacations", vacationsController);
server.use("/api/follow", followController);
server.use("/api/uploads", uploadsController)


if (!fs.existsSync(__dirname + "/uploads")) {
    fs.mkdirSync(__dirname + "/uploads");
}


const expressListener = server.listen(3000, () => {
    console.log("Listening on http://localhost:3000")
});

const socketServer = io(expressListener);

server.use(express.static(__dirname));

socketServer.sockets.on("connection", socket => {
    console.log("One Client has been connected");

    socket.on("update-from-admin", async vacation => {
        console.log("Client.message " + vacation);
        const vacations = await vacationsLogic.getAllVacationsAsync()
        socketServer.sockets.emit("update-from-server", vacations)
    })

    socket.on("disconnect", () => {
        console.log("One Client has disconnected");
    })

})