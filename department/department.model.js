let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let departmentSchema = new Schema({
    name: {type: String, required: true},
    leader: {type: Number},
    created_at: {type:Date, required: true, default: Date.now}
})

let Department = mongoose.model('Department', departmentSchema);

module.exports = {
    insert: async (data) => {
        let department = new Department(data);
        let newDepartment = await department.save();
        return newDepartment;
    },
    get: async (find = {}) => {        
        return await Department.find(find).exec();
    },
    update: async (id, name) => {
        return await Department.updateOne({_id: id}, {name: name});
    },
    delete: async (id) => {
        return await Department.deleteOne({_id: id});
    },
    schema: departmentSchema
}
