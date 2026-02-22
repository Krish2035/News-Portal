import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { create, getPosts } from "../controllers/post.controller.js";

const router = express.Router();

// The verifyToken middleware checks for the "access_token" cookie.
// If valid, it attaches the user to req.user and calls next() to run create.
router.post("/create", verifyToken, create);
router.get("/getposts", getPosts);
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost)

export default router;
