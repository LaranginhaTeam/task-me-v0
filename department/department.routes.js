const departmentController = require('./department.controller.js');

module.exports = function(server){
    server.get('/department', departmentController.get);
    server.post('/department', departmentController.insert);
    server.put('/department', departmentController.update);
    server.delete('/department/:id', departmentController.delete);    
}