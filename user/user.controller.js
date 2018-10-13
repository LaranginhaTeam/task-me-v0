const userModel = require('./user.model.js');
const bcrypt = require('bcrypt');
const fs = require('fs');
var jwt = require('jsonwebtoken');
var cert = fs.readFileSync('./config/private.key');

module.exports = {
    login: async (req, res) =>{
        try{
            let user = await userModel.getUser({'email': req.body.email});
            if(user && await bcrypt.compare(req.body.password, user.password)){
                var token = jwt.sign({ 
                    id: user._id
                }, cert, { algorithm: 'RS256' });
                res.json({
                    code:200, 
                    token
                });
            }else{
                res.json({
                    code:404, 
                    message:"Invalid e-mail or password.",
                });
            }
            

           
        }catch(err){
            console.log(err.message);
            res.json({
                code:500,
                message:err.message,
            })
        }
    },


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
    },

    location: async(req,res) =>{
        try{            
            await userModel.addLocation({
                "id": req.params.id,
                "lat": req.body.lat, 
                "long": req.body.long
            });
            res.json({
                code:200,
                message:"Location added",              
            })
        }catch(err){
            console.log(err.message);
            res.json({
                code:500,
                message:err.message,              
            });
        }
    }
}