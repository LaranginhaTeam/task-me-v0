let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// var LocationSchema = new Schema({
//     coordinates: {
//         type: [Number, Number],
//         index: '2d',
//         timestamp: {type:Date, required: true, default: Date.now}
//     },
// });


let userSchema = new Schema({
    email: {type: String, lowercase: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid']},
    password: {type: String, required: true},
    name: {type: String, required: true},
    type_user: {type: String, required: true},
    department: {type: String, required: true},
    is_leader: {type: Boolean, required: true},
    created_at: {type:Date, required: true, default: Date.now},
    locations: [{lat: Number, long: Number, timestamp: {type:Date, required: true, default: Date.now}}]
})

let User = mongoose.model('User', userSchema);
// var Location = mongoose.model('Location', LocationSchema);

module.exports = {
    insert: async (data) => {
        let user = new User(data);
        let newUser = await user.save();
        return newUser;
    },
    get: async (find = {}) => {        
        return await User.find(find).exec();
    },
    getUser: async (find = {}) => {        
        return await User.findOne(find).exec();
    }, 
    update: async (id, name) => {
        return await User.updateOne({_id: id}, {name: name});
    },
    delete: async (id) => {
        return await User.deleteOne({_id: id});
    },
    addLocation: async (bundle = {}) => {
        return await User.findOneAndUpdate(
            {_id: bundle.id},
            { $push: {locations: {lat: bundle.lat, long:bundle.long}} }
            ); 
    },
    // getLastLocations: async (find = {}) => {
    //     return await User.find({}, {}, { sort: {'locations.timestamp': -1} })
    //     .select('_id locations')
    //     .limit(1);
    // },
    schema: userSchema
}
