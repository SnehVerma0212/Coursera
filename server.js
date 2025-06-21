const express = require("express");
const mongoose = require("mongoose");
const { userRouter } = require("./Routes/user.js");
const { courseRouter } = require("./Routes/course.js");
const { adminRouter } = require("./Routes/admin.js");
const connectDB = require("./db.js");
const dotenv = require("dotenv");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use("/api/v1/user",userRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/course",courseRouter);

app.listen(process.env.PORT);