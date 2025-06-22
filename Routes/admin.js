const { Router } = require("express");
const adminRouter = Router();
const { AdminModel } = require("./../Models/AdminModel");
const { AdminAuth } = require("./../Middlewares/Auth");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1)
})

adminRouter.post("/signup", async (req,res) => {

    const result = signupSchema.safeParse(req.body);

    if(!result.success){
        return res.status(409).json({
            message: "Invalid signup credentials."
        })
    }

    const { email, password, name } = req.body;

    try{
        const CheckUser = await AdminModel.findOne({email});
        if(CheckUser){
            return res.status(401).json({
                message: "Admin already exists."
            })
        }
        const hashedPassword = await bcrypt.hash(password,5);

        await AdminModel.create({
            email,
            password: hashedPassword,
            name
        })        
        res.status(200).json({
            message: "Admin signup successful."
        })
    }catch(e){
        console.log(e);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

adminRouter.post("/signin", async (req,res) => {
    const { email , password } = req.body;
    const Admin = await AdminModel.findOne({email});
    if(!Admin){
        return res.status(409).json({
            message: "Admin Id not found."
        })
    }
    const MatchPassword = await bcrypt.compare(password, Admin.password);
    if(!MatchPassword){
        return res.status(401).json({
            message: "Invalid Password"
        })
    }
    const token = jwt.sign({
        adminId: Admin._id.toString()
    },process.env.JWT_SECRET);
    
    res.status(200).json({
        token: token
    })
})

adminRouter.post("/course", AdminAuth , (req,res) => {

})

adminRouter.delete("/course", AdminAuth,  (req,res) => {

})

adminRouter.put("/course", AdminAuth , (req,res) => {

})

adminRouter.get("/course/bulk", AdminAuth , (req,res) => {

})

module.exports = {
    adminRouter: adminRouter
}