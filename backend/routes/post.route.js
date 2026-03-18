import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  create,
  getPosts,
  deletepost,
  updatepost,
} from "../controllers/post.controller.js";

const router = express.Router();

/**
 * --- POST ROUTES ---
 * Base path: /api/post
 */

// Create a new post (Admin only)
// Path: /api/post/create
router.post("/create", verifyToken, create);

// Get all posts (Public) - Used by Home.jsx and Search features
// Path: /api/post/getposts
router.get("/getposts", getPosts);

// Delete a specific post
// Path: /api/post/deletepost/:postId/:userId
// Note: Ensure these parameter names match exactly what you use in deletepost controller (req.params.postId)
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost);

// Update a specific post
// Path: /api/post/updatepost/:postId/:userId
router.put("/updatepost/:postId/:userId", verifyToken, updatepost);

export default router;