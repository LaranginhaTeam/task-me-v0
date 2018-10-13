const userController = require('./user.controller.js');

module.exports = function(server){
    server.get('/user', userController.get);
    server.post('/user/login', userController.login);
    server.post('/user', userController.insert);
    server.put('/user', userController.update);
    server.delete('/user/:id', userController.delete);    
    server.post('/user/location/:id', userController.location);
}