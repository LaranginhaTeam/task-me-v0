const taskModel = require('./task.model.js');
const userModel = require('../user/user.model.js');
let geolib = require('geolib');
let io = require('../queue/queue.controller.js');

const task_status = {
    ABERTA: 'ABERTA',
    RESERVADO: 'RESERVADO',
    EM_ANDAMENTO: 'EM ANDAMENTO',
    FINALIZADA: 'FINALIZADO'
}

module.exports = {
    insert: async (req, res) =>{
        try{
            let task = await taskModel.insert({
                description: req.body.description,
                department: req.body.department,
                priority: req.body.priority,
                status: req.body.status,
                image: req.body.image,
                location: {lat: req.body.lat, long: req.body.long}
            });
            res.json({
                code:200, 
                message: "task succesfully created.",
                task
            });
        }catch(err){
            res.json({
                code: 400,
                message:err.message,
                task: []
            })
        }
    },

    get: async(req, res) => {
        try{
            let tasks;
            tasks = await taskModel.get(req.query.status ? {status: req.query.status} : {});
            res.json({
                code:200,
                message:"Tasks buscadas com sucesso",
                tasks
            })
        }catch(err){
            res.json({
                code: 400,
                message:err.message,
                tasks: []
            })
        }
    },

    getTask: async(req, res) => {
        try{
            let task = await taskModel.getTask(req.params.id);
            res.json({
                code:200,
                message:"Tasks buscadas com sucesso",
                task
            })
        }catch(err){
            res.json({
                code: 400,
                message:err.message,
                task: []
            })
            console.log(err.message);
        }
    },

    update: async(req, res) =>{
        try{
            await taskModel.updateStatus(req.body.id, req.body.status);
            res.json({
                code:200,
                message:"Task atualizada",              
            })
        }catch(err){
            res.json({
                code: 400,
                message:err.message,              
            })
        }
    },

    delete: async(req,res) =>{
        try{
            await taskModel.delete({_id: req.params.id});
            res.json({
                code:200,
                message:"Task removida com sucesso",              
            })
        }catch(err){
            res.json({
                code: 400,
                message:err.message,              
            })
        }
    },

    accept: async(req, res) =>{
        try{
            await taskModel.updateStatus(req.params.id, task_status.EM_ANDAMENTO);

            io.pendentList.forEach((e, index) => {
                if(e.data.task.id == req.params.id){
                    io.executingTaskList.push(e);
                    io.pendentList.splice(index, 1);
                }
            })

            res.json({
                code: 200,
                message:`Task atualizada para ${task_status.EM_ANDAMENTO}`,              
            })
        }catch(err){
            res.json({
                code: 400,
                message:err.message,              
            })
        }
    },

    refuse: async(req, res) =>{
        try{
            await taskModel.updateStatus(req.params.id, task_status.ABERTA);

            io.pendentList.forEach((e, index) => {
                if(e.data.task.id == req.params.id){
                    console.log(e);
                    io.connectionList.push(e.data.connection);
                    io.taskList.push(e.data.task._doc);
                    io.pendentList.splice(index, 1);
                    console.log(io.taskList);
                    console.log(io.connectionList);
                }
            })

            res.json({
                code:200,
                message:`Task atualizada para ${task_status.ABERTA}`,              
            })
        }catch(err){
            res.json({
                code: 400,
                message:err.message,              
            })
        }
    },

    finalize: async(req, res) =>{
        try{
            let task = await taskModel.getTask(req.params.id);
            task.status = task_status.FINALIZADA;
            task.commentary = req.body.commentary            
            await taskModel.updateTask(task);

            res.json({
                code:200,
                message:`Task atualizada para ${task_status.FINALIZADA}`,              
            })
        }catch(err){
            console.log(err.message);
            res.json({
                code:400,
                message:err.message,              
            })
        }
    },

    getWorkerMostClosed: async(req, res) =>{
        try{
             let task = await taskModel.getTask(req.params.id);
                 
             let task_coordinate = {latitude: task.location.lat, longitude: task.location.long};

            //pegamos os ids dos usuários logados e suas ultimas latitudes e longitudes do socket.
            var users = {
                "5bc1fbc8270ca7508a0911ea": {latitude: 51.515, longitude: 7.453619},
                "5bc1fa6004187e4ef17ffc38": {latitude: 55.751667, longitude: 37.617778}            
            };
            
            // in this case set offset to 1 otherwise the nearest point will always be your reference point
            nearest = geolib.findNearest(task_coordinate, users, 1);

            let user = await userModel.getUser({"_id": nearest.key});
            
            res.json({
                code:200,
                message:"Retornado o funcionário mais próximo.", 
                distance: nearest.distance,
                user             
            })
        }catch(err){
            console.log(err.message);
            res.json({
                code:400,
                message:err.message,              
            })
        }
    },
    //leader can change a worker from a task.
    setWorker: async(req, res) =>{
        try{
            //verify if the user with the token is leader:
            worker = await userModel.getUser({'_id': req.body.worker});
            //verifying if the worker exists:
            if(worker){
                await taskModel.updateWorker(req.params.id, req.body.worker);
                res.json({
                    code:200,
                    message:"Funcionário atualizado.",              
                });
            }else{
                res.json({
                    code:404,
                    message:"Funcionário não encontrado.",              
                });
            }
            
        }catch(err){
            res.json({
                code: 400,
                message:err.message,              
            })
        }
    },

    getFinalizedTasks: async(req, res) =>{
        try{
            let tasks = await taskModel.get({"status": task_status.FINALIZADA});
            res.json({
                code:200,
                message:"Tasks finalized.",
                tasks
            })
        }catch(err){
            console.log(err);
            res.json({
                code: 400,
                message:err.message,
                tasks: []
            })
        }
    },

    
}