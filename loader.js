try{
const server = require("./config/server.js");
const mongoose = require("./config/database.js");
const login = require("./login/login.controller.js");
const express = require('express');

server.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

//let router = server.Router();

//JSON_WEB_TOKEN
//NOT FOR LOGIN
server.use('/scripts', express.static('node_modules'));
server.use('/api', login.verifyTokenMiddleware);

require("./socket/socket.js");
require("./login/login.routes.js")(server)
require("./user/user.routes.js")(server);
require("./task/task.routes.js")(server);
require("./department/department.routes.js")(server);

module.exports = server;
}catch(err){
    console.log(err);
}