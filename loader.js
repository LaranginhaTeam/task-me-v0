const server = require("./config/server.js");
const mongoose = require("./config/database.js");
const login = require("./login/login.controller.js");

server.get("/", (req, res) => {
    res.json({
        running: true
    })
})

//let router = server.Router();

//JSON_WEB_TOKEN
//NOT FOR LOGIN
server.use('/api', login.verifyTokenMiddleware);

require("./login/login.routes.js")(server)
require("./user/user.routes.js")(server);
require("./task/task.routes.js")(server);
require("./department/department.routes.js")(server);

module.exports = server;
