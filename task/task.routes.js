const taskController = require('./task.controller.js');

module.exports = function(server){
    server.get('/api/task', taskController.get);
    server.get('/api/task/:id', taskController.getTask);
    server.post('/api/task', taskController.insert);
    server.put('/api/task', taskController.update);
    server.delete('/api/task/:id', taskController.delete);    
    server.post('/api/task/accept/:id', taskController.accept);  
    server.post('/api/task/refuse/:id', taskController.refuse);
    server.post('/api/task/finalize/:id', taskController.finalize);
    server.get('/api/task/get_worker/:id', taskController.getWorkerMostClosed);
    
}