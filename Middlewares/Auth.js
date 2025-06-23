const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");


dotenv.config();

const UserAuth = async (req,res,next) => {
    const token = req.headers.token;
    const decodedToken = await jwt.verify(token,process.env.JWT_USER_PASSWORD);
    if(decodedToken){
        req.UserId = decodedToken.id;
        next();
    }
    else{
        res.json({
            message : "INVALID TOKEN"
        })
    }
}

const AdminAuth = async (req,res,next) => {
    const token = req.headers.token;
    const decodedToken = await jwt.verify(token,process.env.JWT_ADMIN_PASSWORD);
    if(decodedToken){
        req.AdminId = decodedToken.adminId;
        next();
    }
    else{
        res.json({
            message : "INVALID TOKEN"
        })
    }
}

module.exports = {
    UserAuth,
    AdminAuth
}