const taskController = require('./task.controller.js');

module.exports = function(server){
    server.get('/api/task', taskController.get);
    server.post('/api/task', taskController.insert);
    server.put('/api/task', taskController.update);
    server.delete('/api/task', taskController.delete);    
}