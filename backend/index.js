import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Route Imports
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";

dotenv.config();

// --- DATABASE CONNECTION ---
// Using a more modern approach to ensure the app only starts if DB connects
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

const app = express();

// --- MIDDLEWARE HIERARCHY ---

// 1. CORS Configuration
// Credentials must be true to allow the frontend to send/receive the access_token cookie
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend Dev Port
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// 2. Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Cookie Parsing Middleware
// Essential for verifyToken middleware to access req.cookies
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
// This catches all next(error) calls from your controllers
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

export default app;
