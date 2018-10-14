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
            if(e.connection.socket == socket.id){
                taskList.push(e.task);
                pendentList.splice(index, 1);
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
    setTaskList: (tasks) => {
        taskList = tasks;
    },

    newTask: (task) => {
        taskList.push(task);
    },

    refuseTask: (task) => {
        pendentList.forEach((e, index) => {
            if(e.task.id == task){
                e.timestamp = null;
                taskList.push(e.task);
                connectionList.push(e.connection);
                pendentList.splice(index, 1);   
            }
        })        
    },

    acceptTask: (task) => {
        pendentList.forEach((e, index) => {
            if(e.task.id == task){
                e.timestamp = null;
                executingTaskList.push(e);
                pendentList.splice(index, 1);   
            }
        });        
    },
    completeTask: (task) => {
        executingTaskList.forEach((e, index) => {
            if(e.task.id == task){
                executingTaskList.splice(index, 1);   
            }
        });
    },
    manageTasks: (io) => {    
        //console.log(executingTaskList);          
        for(var task in pendentList){
            if(pendentList[task].timestamp + 500 < new Date().getTime()){
                pendentList[task].timestamp = null;
                taskList.push(pendentList[task].task);
                connectionList.push(pendentList[task].connection);
                pendentList.splice(task, 1);
            }else{
                console.log(pendentList[task].timestamp + 500 - new Date().getTime());
            }
        }

        taskList.sort((a, b) => {
            if(a.priority < b.priority) return 1;
            if(a.priority == b.priority) return 0;
            return -1;
        })                

        for(var task in taskList){
            for(var connection in connectionList){
                let userTask = {
                    id: taskList[task].id,
                    timestamp: new Date().getTime() + 35000
                }

                io.to(connectionList[connection].socket).emit('new_task', userTask);
                
                pendentList.push({
                    connection: connectionList[connection],
                    task: taskList[task],
                    timestamp: userTask.timestamp
                });

                connectionList.splice(connection, 1);
                taskList.splice(task, 1);

                console.log(`Sending ${task} to ${connection}`);
                break;                
            }
        }
    }
}