const userModel = require('../user/user.model.js');
const bcrypt = require('bcrypt');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const cert = fs.readFileSync('./config/private.key');

module.exports = {
    login: async (req, res) =>{
        try{
            let user = await userModel.getUser({'email': req.body.email});
            if(user && await bcrypt.compare(req.body.password, user.password)){
                var token = jwt.sign({ 
                    id: user._id
                }, "laranjinha", { algorithm: 'HS256' });
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
    verifyTokenMiddleware: async (req, res, next) => {
        console.log("Middleware");
        try{
            let result = await jwt.verify(req.body.access_token, "laranjinha", {algorithms: ['HS256']});
            console.log(result);
            next();
        }catch(err){
            console.log(req.body.access_token);
            res.json({
                code:403,
                message: err.message
            })
        }        
    },
    cert
}