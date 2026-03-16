import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import path_module from "path";

// Route Imports
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path_module.dirname(__filename);
const app = express();

/**
 * --- DATABASE CONNECTION (STRICT SERVERLESS CACHING) ---
 */
let cachedDB = null;

const connectDB = async () => {
  if (cachedDB) return cachedDB;

  try {
    mongoose.set("strictQuery", true);
    // Increased timeout and added connection feedback
    const db = await mongoose.connect(process.env.MONGO_URL, {
      dbName: "news-nova",
      serverSelectionTimeoutMS: 8000, // Slightly more time for initial handshake
    });
    cachedDB = db;
    console.log("✅ Database connected successfully");
    return cachedDB;
  } catch (err) {
    console.error("❌ Database connection error:", err);
    // Do not throw here if you want the server to keep trying or handle it in startServer
    throw err; 
  }
};

// --- CORS CONFIGURATION ---
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const isVercel = /\.vercel\.app$/.test(origin);
      const isLocal = origin === "http://localhost:5173";

      if (isVercel || isLocal) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS policy blocked this origin."), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

// Fixed named wildcard for compatibility
app.options("*path", cors());

app.use(cookieParser());
app.use(express.json());

/**
 * --- DATABASE SYNC MIDDLEWARE ---
 * Retained for Vercel/Production serverless environments where
 * the persistent connection might be dropped between calls.
 */
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Database connection failed" });
  }
});

// --- STATIC FILES ---
app.use("/uploads", express.static(path_module.join(__dirname, "uploads")));

// --- ROOT ROUTE ---
app.get("/", (req, res) => {
  res.json({ message: "News Nova API is running smoothly!" });
});

// --- ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

app.use("*path", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Path ${req.originalUrl} not found on this server.`,
  });
});

// --- GLOBAL ERROR HANDLING ---
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, statusCode, message });
});

/**
 * --- EXECUTION ENVIRONMENT & IMMEDIATE INITIALIZATION ---
 * This block ensures that locally, your DB connects as soon as the server starts.
 */
const start = async () => {
  const PORT = process.env.PORT || 3000;
  
  if (process.env.NODE_ENV !== "production") {
    try {
      // Connect to DB immediately in local dev environment
      await connectDB();
      app.listen(PORT, () => {
        console.log(`🚀 Local Server running on port ${PORT}`);
      });
    } catch (err) {
      console.error("Critical: Server failed to start due to DB error.");
    }
  } else {
    // In Vercel production, we export the app for serverless handling
    console.log("Production environment detected.");
  }
};

start();

export default app;