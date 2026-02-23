import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";

dotenv.config();

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database is connected");
  } catch (err) {
    console.error("Database connection error:", err);
  }
};
connectDB();

const app = express();

// --- MIDDLEWARE HIERARCHY (CRITICAL ORDER) ---

// 1. CORS: Must be at the very top to handle pre-flight requests
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true, // Essential for allowing cookies/sessions
  }),
);

// 2. Body Parsers: To read JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Cookie Parser: Must be initialized BEFORE routes to populate req.cookies
app.use(cookieParser());

// --- ROUTES ---

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

// --- SERVER START ---

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});

// --- GLOBAL ERROR HANDLER ---

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

export default app;
