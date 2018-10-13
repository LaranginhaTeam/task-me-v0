const taskModel = require('./task.model.js');


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
            let tasks = await taskModel.get();
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
            await taskModel.delete(req.params.id);
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

    
}