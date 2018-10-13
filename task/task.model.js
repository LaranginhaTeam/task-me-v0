let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let taskSchema = new Schema({
    description: {type: String, required: true},
    department: {type: String, required: true},
    priority: {type: Number, required: true},
    status: {type: String, required: true, default: "ABERTA"},
    image_path: {type: String},
    created_at: {type:Date, required: true, default: Date.now}
})

let Task = mongoose.model('Task', taskSchema);

module.exports = {
    insert: async (data) => {
        let task = new Task(data);
        let newTask = await task.save();
        return newTask;
    },
    get: async (find = {}) => {        
        return await Task.find(find).exec();
    },
    getTask: async (id, find = {}) => {        
        return await Task.findOne({_id: id, ...find}).exec();
    },
    update: async (id, status) => {
        return await Task.updateOne({_id: id}, {status: status});
    },
    delete: async (id) => {
        return await Task.deleteOne({_id: id});
    },
    schema: taskSchema
}
