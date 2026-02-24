import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  editComment,
  getPostComments,
  likeComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

// Middleware verifyToken ensures req.user is populated for createComment
router.post("/create", verifyToken, createComment);

// This ":postId" MUST match req.params.postId in the controller
router.get("/getPostComments/:postId", getPostComments);

router.put("/likeComment/:commentId", verifyToken, likeComment)

router.put("/editComment/:commentId", verifyToken, editComment)

export default router;
