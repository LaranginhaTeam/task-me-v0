const taskModel = require('./task.model.js');

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
                success:true, 
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
                success:true,
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

    update: async(req, res) =>{
        try{
            await taskModel.update(req.body.id, req.body.status);
            res.json({
                success:true,
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
            await taskModel.delete(req.body.id);
            res.json({
                success:true,
                message:"Task removida com sucesso",              
            })
        }catch(err){
            res.json({
                success:false,
                message:err.message,              
            })
        }
    }
}