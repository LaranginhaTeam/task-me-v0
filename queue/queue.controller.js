let geolib = require('geolib');
let connectionList = [];
let pendentList = [];
let taskList = [];
let executingTaskList = [];

module.exports = {
    connectionList,
    pendentList,
    taskList,
    executingTaskList,
    onConnection: (socket, data) => {
        connectionList.push({
            socket: socket.id,
            user: data
        });
    },
    onDisconnect: (socket) => {
        connectionList.forEach((e, index) => {
            if(e.socket == socket.id){
                connectionList.splice(index, 1);
            }
        })

        pendentList.forEach((e, index) => {
            if(e.task.connection){

            }
        });
    },
    onNewTask: (socket, tasklist) => {
        return (task) => {
            taskList.push(task);
        }
    },
    onAcceptTask: (socket, tasklist) => {
        return (task) => {            
        }
    },
    onRefuseTask: (socket) => {
        return (task) => {
            //pendentList.splice(connectionList.map(function(e) {return e.socket}).indexOf(socket.id), 1);
        }
    },
    changeStatus: (socket, connections) => {
        return (status) => {
            connectionList[socket.id].user.enabled = status;
        }
    },
    manageTasks: (io, tasks, connections) => {
        for(var task in pendentList){
            if(pendentList[task].task.timestamp + 500 < new Date().getTime()){
                pendentList[task].task.timestamp = null;
                tasks.push(pendentList[task].task);
                connectionList.push(pendentList[task].connection);
                pendentList.splice(task, 1);
            }else{
                console.log(pendentList[task].task.timestamp + 500 - new Date().getTime());
            }
        }

        tasks.sort((a, b) => {
            if(a.priority < b.priority) return 1;
            if(a.priority == b.priority) return 0;
            return -1;
        })        

        for(var task in tasks){
            for(var connection in connectionList){
                let userTask = {
                    id: tasks[task].id,
                    timestamp: new Date().getTime() + 35000
                }

                io.to(connectionList[connection].socket).emit('new_task', userTask);
                
                pendentList.push({
                    connection: connections[connection],
                    task: { ...tasks[task], ...userTask}
                });

                connectionList.splice(connection, 1);
                tasks.splice(task, 1);

                console.log(tasks);
                console.log(connectionList);

                console.log(`Sending ${task} to ${connection}`);
                break;                
            }
        }
    }
}