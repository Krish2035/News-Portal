import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"

dotenv.config();

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database is connected")
    }catch(err){
        console.error(err)
    }
};

const app = express()
app.use(express.json());
app.use(cookieParser)
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

connectDB();

app.listen(3000, () => {
    console.log("Server is running on port 3000!");
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500

    const message = err.message || "Internal Server error"

    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

console.log("MONGO_URL=", process.env.MONGO_URL);