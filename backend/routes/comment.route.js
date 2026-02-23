import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  getPostComments,
} from "../controllers/comment.controller.js";

const router = express.Router();

// Middleware verifyToken ensures req.user is populated for createComment
router.post("/create", verifyToken, createComment);

// This ":postId" MUST match req.params.postId in the controller
router.get("/getPostComments/:postId", getPostComments);

export default router;
