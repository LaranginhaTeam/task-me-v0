const chatModel = require('./chat.model.js');
const userModel = require('../user/user.model.js');
const bcrypt = require('bcrypt');

//sendMessage: (socket) => {
saveMessage: async (message, socket, connections) => {
    //return (leader, worker, sender, message) =>{
    try {
        leader = req.body.leader;
        worker = req.body.worker;
        sender = req.body.sender;
        message = message;

        chat = await chatModel.getChat({ leader, worker });
        //if not exists:
        if (!chat) {

            await chatModel.insert({ leader, worker });
        }
        await chatModel.addMessage({ leader, worker, sender, message });
        chat = await chatModel.getChat({ leader, worker });


    } catch (err) {

    }
    socket.to(receiver).emit("new_message", { message });
},




    module.exports = {

        getMessages: async (req, res) => {

            try {
                leader = req.body.leader;
                worker = req.body.worker;
                chat = await chatModel.getChat({ leader, worker });

                if (chat) {
                    res.json({
                        code: 200,
                        messages: chat.messages
                    });
                }
                else {
                    res.json({
                        code: 200,
                        messages: []
                    });
                }


            } catch (err) {
                console.log(err);
                res.json({
                    code: 500,
                    message: err.message,
                })
            }
        },

        receiveMessages: (socket, connections) => {
            return async (message) => {
               

                //pegando o id do usuário:
                let sender_id = connections[socket.id].user.id;
                let user = await userModel.getUser({ "_id": sender_id });

                let receiver = await userModel.getUser({ "is_leader": true, "department": user.department });
                let socket_receiver;


                for (let i in connections) {

                    if (receiver._id == connections[i].user.id) socket_receiver = i;
                }
                
                socket.to(socket_receiver).emit("receive_messages", { message });
            }
        },
        sendMessage: async (message, socket, connections) => {
          
            //pegando o id do usuário:
            let sender_id = connections[socket.id].user.id;
           
            let user = await userModel.getUser({ "_id": sender_id });
           

            let receiver = await userModel.getUser({ "is_leader": true, "department": user.department });
            let socket_receiver;

          

            for (let i in connections) {

                if (receiver._id == connections[i].user.id) socket_receiver = i;
            }

            worker = user._id;
            leader = receiver._id;
            sender = user._id;

            chat = await chatModel.getChat({ leader, worker });
            //if not exists:
            if (!chat) {

                await chatModel.insert({ leader, worker });
            }
            await chatModel.addMessage({ leader, worker, sender, message });
            chat = await chatModel.getChat({ leader, worker });

            socket.to(socket_receiver).emit("receive_messages", { message });
        },

        leaderSendMessage: async (message, worker, socket, connections) => {
           

            //pegando o id do LIDER:
            let sender_id = connections[socket.id].user.id;
            
            let user = await userModel.getUser({ "_id": sender_id });
            

            let socket_receiver;

    
            for (let i in connections) {

                if (worker == connections[i].user.id) socket_receiver = i;
            }

            leader = user._id;
            sender = user._id;

            chat = await chatModel.getChat({ leader, worker });
            //if not exists:
            if (!chat) {

                await chatModel.insert({ leader, worker });
            }
            await chatModel.addMessage({ leader, worker, sender, message });
            chat = await chatModel.getChat({ leader, worker });

           
            socket.to(socket_receiver).emit("receive_messages", { message });
        },

        getOnlineUsers: async (socket, connections) => {

            let users = [];
            for (let i in connections) {
                users[i] = await userModel.getUser({ "_id": connections[i].user.id });
            }
            socket.emit("online_users", { users });
        },

    }