const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const courseSchema = new Schema({
    title : String,
    description : String,
    price : Number,
    creatorId : ObjectId
})

const CourseModel = mongoose.model("courses",courseSchema);

module.exports = {
    CourseModel: CourseModel
}