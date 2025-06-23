const { Router } = require("express");
const courseRouter = Router();
const { CourseModel } = require("./../Models/CourseModel");
const { PurchaseModel } = require("./../Models/PurchaseModel");
const { UserAuth } = require("../Middlewares/Auth");

courseRouter.get("/preview", async (req,res) => {
    const Courses = await CourseModel.find({});
    res.json({
        message : Courses
    })
})

courseRouter.post("/purchase", UserAuth , async (req,res) => {
    const UserId = req.UserId;
    console.log("UserId: ", UserId);
    const CourseId = req.body.courseId;
    try{
        await PurchaseModel.create({
            courseId: CourseId,
            userId: UserId
        })
        const Course = await CourseModel.findById(CourseId);
        res.json({
            message : "Successfully Purchased the course.",
            course: Course
        })
    }catch(e){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

module.exports = {
    courseRouter: courseRouter
}