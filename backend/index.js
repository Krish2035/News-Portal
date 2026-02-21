import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; // 1. Import cors
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database is connected");
  } catch (err) {
    console.error("Database connection error:", err);
  }
};

const app = express();

// 2. CONFIGURE CORS (Must be before routes)
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true, // Allows cookies to be sent
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

connectDB();

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
