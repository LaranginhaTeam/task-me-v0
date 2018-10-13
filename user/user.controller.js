const userModel = require('./user.model.js');
const bcrypt = require('bcrypt');

module.exports = {
    insert: async (req, res) =>{
        try{
            let hashedPassword = await bcrypt.hash(req.body.password, 10);
            let user = await userModel.insert({
                name: req.body.name,
                email: req.body.email,
                type_user: req.body.type_user,
                department: req.body.department,
                is_leader: req.body.is_leader,
                password: hashedPassword
            });
            res.json({
                success:true, 
                message: "user succesfully created.",
                user
            });
        }catch(err){
            res.json({
                success:false,
                message:err.message,
                user: []
            })
        }
    },

    get: async(req, res) => {
        try{
            let users = await userModel.get();
            res.json({
                success:true,
                message:"Usuários buscados com sucesso",
                users
            })
        }catch(err){
            res.json({
                success:false,
                message:err.message,
                user: []
            })
        }
    },

    update: async(req, res) =>{
        try{
            await userModel.update(req.body.id, req.body.name);
            res.json({
                success:true,
                message:"Usuário atualizado",              
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
            await userModel.delete(req.params.id);
            res.json({
                success:true,
                message:"Usuário removido com sucesso",              
            })
        }catch(err){
            res.json({
                success:false,
                message:err.message,              
            })
        }
    }
}