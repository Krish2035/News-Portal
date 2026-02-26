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
 * @route   POST /api/post/create
 * @desc    Create a new post (Admin only)
 */
router.post("/create", verifyToken, create);

/**
 * @route   GET /api/post/getposts
 * @desc    Get all posts with filters (Public)
 * Matches Home.jsx: fetch("/api/post/getposts?limit=6")
 */
router.get("/getposts", getPosts);

/**
 * @route   DELETE /api/post/deletepost/:postId/:userId
 * @desc    Delete a specific post (Admin/Owner only)
 */
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost);

/**
 * @route   PUT /api/post/updatepost/:postId/:userId
 * @desc    Update a specific post (Admin/Owner only)
 */
router.put("/updatepost/:postId/:userId", verifyToken, updatepost);

export default router;
