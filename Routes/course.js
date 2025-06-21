const { Router } = require("express");
const courseRouter = Router();
const { CourseModel } = require("./../Models/CourseModel");

courseRouter.get("/preview", (req,res) => {
    res.json({
        message : "course preview endpoint"
    })
})

courseRouter.post("/purchase", (req,res) => {
    res.json({
        message : "signup endpoint"
    })
})

module.exports = {
    courseRouter: courseRouter
}