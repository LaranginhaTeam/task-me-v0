let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let chatSchema = new Schema({
    leader: {type: String, required: true},
    worker: {type: String, required: true},
    messages: [{description: String, sender: String, timestamp: {type:Date, required: true, default: Date.now}}]
});

let Chat = mongoose.model('Chat', chatSchema);

module.exports = {
    insert: async (data) => {
        let chat = new Chat(data);
        let newChat = await chat.save();
        return newChat;
    },
    getChat: async (find = {}) => {        
        return await Chat.findOne({leader: find.leader, worker: find.worker});
    },
    addMessage: async (bundle = {}) => {
        return await Chat.findOneAndUpdate(
            {leader: bundle.leader, worker: bundle.worker},
            { $push: {messages: {description: bundle.message, sender: bundle.sender}} }
            ); 
    },
    schema: chatSchema
}
