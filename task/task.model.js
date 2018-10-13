let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let taskSchema = new Schema({
    description: {type: String, required: true},
    department: {type: String, required: true},
    priority: {type: Number, required: true},
    status: {type: String, required: true, default: "ABERTA"},
    commentary: {type: String},
    image: {type: String},
    created_at: {type:Date, required: true, default: Date.now},
    location: {lat: Number, long: Number, timestamp: {type:Date, required: true, default: Date.now}},
    worker: {type: String}
})

let Task = mongoose.model('Task', taskSchema);

update = async (find, data) => {
    return await Task.updateOne(find, data);
}

updateTask = async(task) => {
    let {_id, _doc} = task;
    return await Task.updateOne({_id}, _doc);
}

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
    update,
    updateTask,
    delete: async (id) => {
        return await Task.deleteOne({_id: id});
    },
    updateStatus: async(id, status) => {
        return update({_id: id}, {status})
    },
    finalize: async(id, status, commentary) => {
        return update({_id: id}, {status, commentary})
    },
    updateWorker: async(id, worker) => {
        return update({_id: id}, {worker})
    },
    getFinalizedTasks: async(find = {}) => {
    //    return  await Task.find(find).sort({'created_at': 1}).exec();
        return  await Task.find(find).exec();
    },
    schema: taskSchema
}
