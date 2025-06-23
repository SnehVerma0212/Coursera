const { Router } = require("express");
const userRouter = Router();
const { UserModel } = require("./../Models/UserModel");
const { PurchaseModel } = require("./../Models/PurchaseModel");
const { CourseModel } = require("./../Models/CourseModel");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { UserAuth } = require("./../Middlewares/Auth");
//const PurchaseModel = require("../Models/PurchaseModel");

dotenv.config();

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstname: z.string().min(1),
    lastname: z.string().min(1)
})

userRouter.post("/signup", async (req,res) => {

    // Validating input using zod
    const result = signupSchema.safeParse(req.body);
    
    if(!result.success){
        res.status(409).json({
            message: "Invalid signup credentials."
        })
    }
    
    const email = req.body.email;
    const password = req.body.password;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const hashedPassword = await bcrypt.hash(password,5);

    try{
        const UserAlreadyExists = await UserModel.findOne({email});
        if(UserAlreadyExists){
            res.status(401).json({
                message: "User already exists."
            })
        }

        await UserModel.create({
            email,
            password: hashedPassword,
            firstname,
            lastname
        })

        res.status(200).json({
            message: "User signup successfull"
        })
    }catch(e){
        console.log("Signup error: ",e);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

userRouter.post("/signin", async (req,res) => {
    const { email , password } = req.body;
    const User = await UserModel.findOne({email}); 
    if(!User){
        res.json({
            message: "User doesn't exists"
        })
        return
    }
    const CheckPassword = await bcrypt.compare(password,User.password);
    if(CheckPassword){
        const token = jwt.sign({
            id: User._id.toString()
        },process.env.JWT_USER_PASSWORD);

        res.json({
            token: token
        })
    }else{
        res.json({
            message: "Incorrect Password."
        })
    }
})

userRouter.get("/purchasedCourses", UserAuth, async (req,res) => {
    const UserId = req.UserId;
    try{
        const Purchases = await PurchaseModel.find({
            userId: UserId
        })
        const Courses = await CourseModel.find({
            _id: {$in : Purchases.map(x => x.courseId)}
        })
        res.json({ 
            courses: Courses  
        });
    }catch(e){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

module.exports = {
    userRouter: userRouter
}