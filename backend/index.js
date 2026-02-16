import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.route.js"

dotenv.config();

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("connected")
    }catch(err){
        console.error(err)
    }
};

const app = express()

// parse JSON and urlencoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mount routes before starting the server
app.use('/api/auth', authRoutes);

// simple health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

connectDB();

app.listen(3000, () => {
    console.log("Server is running on port 3000!");
});
