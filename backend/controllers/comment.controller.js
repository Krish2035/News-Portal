// 1. Point this to your MODELS folder, not the controllers folder
import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (!content || content.trim() === "") {
      return next(errorHandler(400, "Comment content is required"));
    }

    // Ensure req.user exists (populated by your verifyUser middleware)
    if (userId !== req.user.id) {
      return next(errorHandler(403, "You are not allowed to add comment!"));
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });

    await newComment.save();

    return res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    // FIXED: Changed 'Comments.find' to 'Comment.find' to match your import
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
