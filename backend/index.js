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

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URL, { 
      dbName: "news-nova" 
    });
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Database connection error:", err);
    if (process.env.NODE_ENV !== "production") process.exit(1);
  }
};

// --- CORS CONFIGURATION ---
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000", /\.vercel\.app$/];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(a => a instanceof RegExp ? a.test(origin) : a === origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

app.use(cors(corsOptions));

app.options(/.*/, cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "DB Connection Error" });
  }
});

app.use("/uploads", express.static(path_module.join(__dirname, "uploads")));

// --- API ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "News Nova API is live!" });
});

/**
 * FIXED FOR EXPRESS 5:
 * Catch-all 404 handler using Regex literal
 */
app.all(/.*/, (req, res) => {
  res.status(404).json({
    success: false,
    message: `Path ${req.originalUrl} not found.`,
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ 
    success: false, 
    statusCode, 
    message: err.message || "Internal Server Error" 
  });
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Local Server running on http://localhost:${PORT}`);
    connectDB();
  });
}

export default app;