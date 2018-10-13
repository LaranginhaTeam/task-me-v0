const userModel = require('../user/user.model.js');
const bcrypt = require('bcrypt');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const cert = fs.readFileSync('./config/private.key');

decodeToken = (token) =>{
    try{
        return jwt.verify(token, "laranjinha", {algorithms: ['HS256']});
    }catch(err){
        console.log(err)
        return null;
    }
}

module.exports = {
    login: async (req, res) =>{
        try{
            let user = await userModel.getUser({'email': req.body.email});
            
            if(user){
                let {password, ...data} = user._doc;
                if(await bcrypt.compare(req.body.password, user.password)){
                    var token = jwt.sign({ 
                        id: user._id
                    }, "laranjinha", { algorithm: 'HS256' });
                    res.json({
                        code:200, 
                        token,
                        user:data
                    });
                    return;
                }           
            }

            res.json({
                code:403, 
                message:"Invalid e-mail or password.",
            });
        }catch(err){
            console.log(err.message);
            res.json({
                code:500,
                message:err.message,
            })
        }
    },
    decodeToken,
    verifyTokenMiddleware: async (req, res, next) => {
        try{            
            let result = jwt.verify(req.body.access_token||req.query.access_token, "laranjinha", {algorithms: ['HS256']});
            next();
        }catch(err){
            console.log(req.query.acces_token);
            res.json({
                code:403,
                message: err.message
            })
        }        
    },
    cert
}