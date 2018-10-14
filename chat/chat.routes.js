const chatController = require('./chat.controller.js');

module.exports = function(server){
    server.get('/api/chat', chatController.getMessages);
    //server.post('/api/chat', chatController.sendMessage);
}