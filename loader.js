const server = require("./config/server.js");
const mongoose = require("./config/database.js");

server.get("/", (req, res) => {
    res.json({
        running: true
    })
})

require("./user/user.routes.js")(server);
require("./task/task.routes.js")(server);

module.exports = server;
