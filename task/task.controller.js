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
                status: req.body.status                
            });
            res.json({
                code:200, 
                message: "task succesfully created.",
                task
            });
        }catch(err){
            res.json({
                success:false,
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
                success:false,
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
                success:false,
                message:err.message,
                task: []
            })
        }
    },

    update: async(req, res) =>{
        try{
            await taskModel.update(req.body.id, req.body.status);
            res.json({
                code:200,
                message:"Task atualizada",              
            })
        }catch(err){
            res.json({
                success:false,
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
                success:false,
                message:err.message,              
            })
        }
    },

    accept: async(req, res) =>{
        try{
            await taskModel.update(req.params.id, task_status.EM_ANDAMENTO);
            res.json({
                code: 200,
                message:`Task atualizada para ${task_status.EM_ANDAMENTO}`,              
            })
        }catch(err){
            res.json({
                success:false,
                message:err.message,              
            })
        }
    },

    refuse: async(req, res) =>{
        try{
            await taskModel.update(req.params.id, task_status.ABERTA);
            res.json({
                code:200,
                message:`Task atualizada para ${task_status.ABERTA}`,              
            })
        }catch(err){
            res.json({
                success:false,
                message:err.message,              
            })
        }
    },

    finalize: async(req, res) =>{
        try{
            await taskModel.update(req.params.id, task_status.FINALIZADA);
            res.json({
                code:200,
                message:`Task atualizada para ${task_status.FINALIZADA}`,              
            })
        }catch(err){
            res.json({
                success:false,
                message:err.message,              
            })
        }
    },

    
}