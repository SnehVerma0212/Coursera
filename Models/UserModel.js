const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String, 
    password: String,
    firstname: String,
    lastname: String
});

const UserModel = mongoose.model("users", userSchema);

module.exports = {
    UserModel
}