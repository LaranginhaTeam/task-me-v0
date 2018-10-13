const departmentModel = require('./department.model.js');
const bcrypt = require('bcrypt');

module.exports = {
    insert: async (req, res) =>{
        try{
            let department = await departmentModel.insert({
                name: req.body.name
            });
            res.json({
                code:200, 
                message: "department succesfully created.",
                department
            });
        }catch(err){
            res.json({
                code:500, 
                message:err.message,
                department: []
            })
        }
    },

    get: async(req, res) => {
        try{
            let departments = await departmentModel.get();
            res.json({
                code:200,
                message:"Departamentos buscados com sucesso",
                departments
            })
        }catch(err){
            res.json({
                code:500, 
                message:err.message,
                department: []
            })
        }
    },

    update: async(req, res) =>{
        try{
            await departmentModel.update(req.body.id, req.body.name);
            res.json({
                code:200, 
                message:"Departamento atualizado",              
            })
        }catch(err){
            res.json({
                code:500, 
                message:err.message,              
            })
        }
    },

    delete: async(req,res) =>{
        try{
            await departmentModel.delete(req.params.id);
            res.json({
                code:200, 
                message:"Departamento removido com sucesso",              
            })
        }catch(err){
            res.json({
                code:500, 
                message:err.message,              
            })
        }
    }
}