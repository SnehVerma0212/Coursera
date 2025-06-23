const { Router } = require("express");
const adminRouter = Router();
const { AdminModel } = require("./../Models/AdminModel");
const { AdminAuth } = require("./../Middlewares/Auth");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { CourseModel } = require("../Models/CourseModel");

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
    },process.env.JWT_ADMIN_PASSWORD);
    
    res.status(200).json({
        token: token
    })
})

adminRouter.post("/course", AdminAuth , async (req,res) => {
    const AdminId = req.AdminId;
    const { title , description , price } = req.body;

    try{
        await CourseModel.create({
            title,
            description,
            price,
            creatorId: AdminId
        })
        res.status(200).json({
            message: "Successfully created a new course"
        })
    }catch(e){
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }

})

adminRouter.put("/course", AdminAuth, async (req,res) => {
    const AdminId = req.AdminId;
    const { CourseId, ...updates } = req.body;
    try{
        const Courses = await CourseModel.find({creatorId: AdminId});
        if(Courses.length === 0){
            return res.json({
                message: "This Admin doesn't have any courses."
            });
        }else{
            const FoundCourse = Courses.find(course => course._id.toString() === CourseId);
            if(!FoundCourse){
                return res.json({
                    message: "No course found with the given courseId"
                })
            }
            const UpdateCourse = await CourseModel.findByIdAndUpdate(
                CourseId,
                { $set: updates},
                { new: true}
            )
            res.status(200).json({
                UpdatedCourse: UpdateCourse 
            })
        }
    }catch(e){
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

adminRouter.delete("/course", AdminAuth , async (req,res) => {
    const AdminId = req.AdminId;
    const CourseId = req.body.courseId;

    try{
        const Courses = await CourseModel.find({
            creatorId: AdminId
        })
        if(Courses.length === 0){
            return res.json({
                message: "This Admin doesn't have any courses."
            });
        }else{
            const FoundCourse = Courses.find(course => course._id.toString() === CourseId);
            if(!FoundCourse){
                return res.json({
                    message: "No course found with the given courseId"
                })
            }
            const DeleteCourse = await CourseModel.findByIdAndDelete(CourseId);
            res.status(200).json({
                CourseDeleted: DeleteCourse
            })
        }
    }catch(e){
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

adminRouter.get("/course/bulk", AdminAuth , async (req,res) => {
    const AdminId = req.AdminId;
    const Courses = await CourseModel.find({creatorId: AdminId});
    res.json({
        "message": Courses
    })
})

module.exports = {
    adminRouter: adminRouter
}