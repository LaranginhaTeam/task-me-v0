var app = require('../config/server.js');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var login = require('../login/login.controller.js');

const queueController = require('../queue/queue.controller.js');
const taskModel = require('../task/task.model.js');
const userModel = require('../user/user.model.js');

var storedConnections = queueController.connectionList;


taskModel.getOpenTasks({status: "ABERTA"}).then((tasklist) => {
    queueController.tasklist = tasklist;
    setInterval(queueController.manageTasks , 100, io, tasklist, storedConnections);
});

let newConnection = (socket) => {
    let decoded = login.decodeToken(socket.request._query.access_token);
    storedConnections.forEach((element, index) => {
        if(element.user.id == decoded.id){
            io.sockets.connected[index].disconnect();
            storedConnections.splice(index, 1);
        }
    });

    let data = {
        user: {
            id: decoded.id,
            department: decoded.department,
            name: decoded.name,
            task:null,
            active: true
        }
    }
    queueController.onConnection(socket, data);
}

let updateUserLocation = (socket, connections) => {
    return (data) => {
        connections.forEach((e, index) => {
            if(e.socket == socket.id){
                e.user.location = data;
                userModel.addLocation({
                    "id": e.user.id,
                    "lat": data.latitude, 
                    "long": data.longitude
                })
                console.log("SALVE");
            }
        })
        //connections[socket.id].user.location = data;
    }
}

io.on('connection', function(socket){
    console.log("New connection");        
    if(!socket.request._query.access_token) {
        socket.disconnect();
        return;
    }

    newConnection(socket, socket.req)

    socket.on('my_location', updateUserLocation(socket, storedConnections));
    socket.on('location_status', queueController.changeStatus(socket, storedConnections));    

    socket.on('accept_task', queueController.onAcceptTask(socket, queueController.tasklist));
    socket.on('refuse_task', queueController.onRefuseTask(socket, queueController.tasklist));

    socket.on('disconnect', (reason) => {
        queueController.onDisconnect(socket);
        console.log("Usuario desconectado");
    });
});

http.listen(5001, function(){
    console.log("Waiting sockets connected on port 5001");
});

module.exports = {
    io,
    connections: storedConnections
}