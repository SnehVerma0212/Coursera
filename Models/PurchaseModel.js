const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const PurchaseSchema = new Schema({
    courseId : ObjectId,
    userId : ObjectId
})

const PurchaseModel = mongoose.model("purchases",PurchaseSchema);

module.exports = {
    PurchaseModel: PurchaseModel
}