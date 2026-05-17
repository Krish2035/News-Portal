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
 * DATABASE CONNECTION
 * Optimized for Serverless: Checks for existing connections to prevent overhead.
 */
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
  }
};

/**
 * CORS CONFIGURATION
 * Note: credentials: true requires an explicit 'origin'. '*' is not allowed.
 */
const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:3000", 
  "https://news-portal-nu-three.vercel.app",
  "https://news-portal-frontend-tan.vercel.app"
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or server-to-server)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || origin.endsWith(".vercel.app");
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  credentials: true, // Crucial for cross-domain JWT cookies
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With", 
    "Accept",
    "Access-Control-Allow-Origin"
  ],
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

app.options(/.*/, cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

// Auto-connect to DB for every request (Required for Vercel/Serverless)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Static Assets
app.use("/uploads", express.static(path_module.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({ message: "News Nova API is live!" });
});

app.use(/.*/, (req, res) => {
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

/**
 * LOCAL DEVELOPMENT SERVER
 * Vercel uses the exported 'app' instance, so we only listen locally.
 */
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Local Server running on http://localhost:${PORT}`);
  });
}

export default app;