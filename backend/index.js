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
 * --- DATABASE CONNECTION (STRICT SERVERLESS HANDLING) ---
 */
let cachedDB = null;

const connectDB = async () => {
  if (cachedDB) return cachedDB;

  try {
    mongoose.set("strictQuery", true);
    const db = await mongoose.connect(process.env.MONGO_URL, {
      dbName: "news-nova",
      serverSelectionTimeoutMS: 5000, 
    });
    cachedDB = db;
    console.log("Database connected successfully");
    return cachedDB;
  } catch (err) {
    console.error("Database connection error:", err);
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

/**
 * FIXED: Replaced "*" with "(.*)" to prevent PathError [TypeError]
 * This was the specific cause of your 500 Internal Server Error.
 */
app.options("*path", cors());

app.use(cookieParser());
app.use(express.json());

// --- DATABASE MIDDLEWARE ---
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Database Connection Error" });
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

/**
 * FIXED: 404 CATCH-ALL
 * Also using regex to avoid parsing errors in newer Express versions.
 */
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

// --- EXECUTION ENVIRONMENT ---
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Local Server running on port ${PORT}`);
  });
}

export default app;