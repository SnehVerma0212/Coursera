const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    email : {type : String, unique : true},
    password : String,
    name : String
});

const AdminModel = mongoose.model("admin",AdminSchema);

module.exports = {
    AdminModel: AdminModel
}