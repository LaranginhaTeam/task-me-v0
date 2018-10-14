const chatController = require('./chat.controller.js');

module.exports = function(server){
    server.get('/api/chat', chatController.getMessages);
    //server.get('/api/chat/get_online_workers', chatController.getOnlineWorkers);
    //server.post('/api/chat', chatController.sendMessage);
}