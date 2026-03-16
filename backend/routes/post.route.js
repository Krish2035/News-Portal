import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  create,
  getPosts,
  deletepost,
  updatepost,
} from "../controllers/post.controller.js";

const router = express.Router();

// Create a new post (Admin only)
router.post("/create", verifyToken, create);

// Get all posts (Public) - This is the one Home.jsx calls
router.get("/getposts", getPosts);

// Delete a specific post
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost);

// Update a specific post
router.put("/updatepost/:postId/:userId", verifyToken, updatepost);

export default router;