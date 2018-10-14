const userController = require('./user.controller.js');

module.exports = function(server){
    server.get('/api/user', userController.get);
    server.get('/api/user/:id', userController.getUser);
    server.get('/api/user/connected', userController.getConnectedUsers);
    server.post('/api/user', userController.insert);
    server.put('/api/user', userController.update);
    server.delete('/api/user/:id', userController.delete);    
    server.post('/api/user/location/:id', userController.location);
}