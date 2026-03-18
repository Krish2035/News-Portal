import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  deleteComment,
  editComment,
  getComments,
  getPostComments,
  likeComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

/**
 * --- COMMENT ROUTES ---
 * Base path: /api/comment
 */

// Create a new comment (Authenticated users only)
// Path: /api/comment/create
router.post("/create", verifyToken, createComment);

// Get all comments for a specific post
// Path: /api/comment/getPostComments/:postId
router.get("/getPostComments/:postId", getPostComments);

// Like or unlike a comment
// Path: /api/comment/likeComment/:commentId
router.put("/likeComment/:commentId", verifyToken, likeComment);

// Edit an existing comment (Owner only)
// Path: /api/comment/editComment/:commentId
router.put("/editComment/:commentId", verifyToken, editComment);

// Delete a comment (Owner or Admin)
// Path: /api/comment/deleteComment/:commentId
router.delete("/deleteComment/:commentId", verifyToken, deleteComment);

// Get all comments across the portal (Admin only)
// Path: /api/comment/getcomments
router.get("/getcomments", verifyToken, getComments);

export default router;