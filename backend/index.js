import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("connected")
    }catch(err){
        console.error(err)
    }
};

const app = express();

connectDB();

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});
