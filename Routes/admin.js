const { Router } = require("express");
const adminRouter = Router();
const { AdminModel } = require("./../Models/AdminModel");
const { AdminAuth } = require("./../Middlewares/Auth");

adminRouter.post("/signup", (req,res) => {

})

adminRouter.post("/signin", (req,res) => {

})

adminRouter.use(AdminAuth);

adminRouter.post("/course", (req,res) => {

})

adminRouter.delete("/course", (req,res) => {

})

adminRouter.put("/course", (req,res) => {

})

adminRouter.get("/course/bulk", (req,res) => {

})

module.exports = {
    adminRouter: adminRouter
}