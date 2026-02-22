import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  create,
  getPosts,
  deletepost,
} from "../controllers/post.controller.js";

const router = express.Router();

// Create a new post - Protected by verifyToken
router.post("/create", verifyToken, create);

// Get posts - Public route
router.get("/getposts", getPosts);

// Delete a post - Protected by verifyToken
// Make sure the parameters (:postId and :userId) match your controller's req.params
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost);

export default router;
