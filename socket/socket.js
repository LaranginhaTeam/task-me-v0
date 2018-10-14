var app = require('../config/server.js');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var login = require('../login/login.controller.js');
const chatController = require('../chat/chat.controller.js');

var storedConnections = [];

io.on('connection', function(socket){
    
    console.log(login.decodeToken(socket.request._query.access_token));
    storedConnections[socket.id] = {
        user: {
            id: login.decodeToken(socket.request._query.access_token).id,
            // location,
            task: null,
            active: true
        } 
    };
    socket.on('my_location', (data) => {
        console.log(data);
        storedConnections[socket.id].user.location = data;
    });

    socket.on('location_status', (data) => {
         storedConnections[socket.id].user.active = data;
    });

    socket.on('disconnect', (reason) => {
        console.log("Usuario desconectado");
    });

    socket.on('receive_messages', chatController.receiveMessages(socket, storedConnections));
    socket.on('send_message', (message) => {
        chatController.sendMessage(message, socket, storedConnections);
    });
    socket.on('leader_send_message', (message, worker) => {
        chatController.leaderSendMessage(message, worker, socket, storedConnections);
    });

    socket.on('online_users', (access_token) => {
        chatController.getOnlineUsers(socket, storedConnections);
    });
});

var tasklist = [
    {name: "task1"},
    {name: "task2"}
]

setInterval(() => {
    for(var task in tasklist){
        if(!tasklist[task].assigned) {
            if(!task.timestamp || new Date() - task.timestamp > 30)
            {
                if(new Date() - task.timestamp > 30)
                {                    
                    storedConnections[tasklist[task].user].user.task = null;
                }
                for(var i in storedConnections){
                    if(storedConnections[i].user.active == true && storedConnections[i].user.task == null){
                        tasklist[task].timestamp = new Date();
                        tasklist[task].user = i;
                        storedConnections[i].user.task = task;
                        io.to(i).emit('new_task', tasklist[task]);
                        console.log(`Enviando task ${task} para ${i}`)
                    }
                }
            }else{
                console.log("Salve");
            }
        }else{
            console.log("task assigned");
        }
    }
    
}, 1000);

http.listen(5001, function(){
    console.log("Waiting sockets connected on port 5001");
});

module.exports = {
    io,
    storedConnections
}