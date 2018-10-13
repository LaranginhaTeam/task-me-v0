const loginController = require('./login.controller.js');

module.exports = function(server){    
    server.post('/login', loginController.login);
}