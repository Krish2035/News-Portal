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
// Ensured the MONGO_URL is being read correctly
if (!process.env.MONGO_URL) {
  console.error("CRITICAL ERROR: MONGO_URL is not defined in .env file");
  process.exit(1);
}

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
// Important: origin must match your Vite dev server address exactly
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// 2. Cookie Parsing Middleware (Must be BEFORE routes)
app.use(cookieParser());

// 3. Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  const message = err.message || "Internal Server Error";

  // Log the error to the backend terminal so you can see the stack trace
  console.error(`[Error] ${statusCode}: ${message}`);
  if (statusCode === 500) {
    console.error(err.stack); // This reveals the exact line where the code broke
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

export default app;
