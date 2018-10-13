let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    created_at: {type:Date, required: true, default: Date.now}
})

let User = mongoose.model('Member', userSchema);

module.exports = {
    insert: async (data) => {
        let user = new User(data);
        let newUser = await user.save();
        return newUser;
    },
    get: async (find = {}) => {        
        return await User.find(find).exec();
    },
    update: async (id, name) => {
        return await User.updateOne({_id: id}, {name: name});
    },
    delete: async (id) => {
        return await User.deleteOne({_id: id});
    },
    schema: userSchema
}
