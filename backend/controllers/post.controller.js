import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return next(errorHandler(403, "You are not authorized to create a post!"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all the required fields!"));
  }

  // Improved slug generation to prevent empty strings or double dashes
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "")
    .replace(/-+/g, "-") + 
    "-" + Math.random().toString(36).slice(-4);

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id || req.user._id,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const query = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    };

    const posts = await Post.find(query)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const deletepost = async (req, res, next) => {
  const currentUserId = req.user?.id || req.user?._id;
  if (!req.user.isAdmin || currentUserId !== req.params.userId) {
    return next(errorHandler(403, "You are not authorized to delete this post!"));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json({ message: "Post has been deleted!" });
  } catch (error) {
    next(error);
  }
};

export const updatepost = async (req, res, next) => {
  const currentUserId = req.user?.id || req.user?._id;
  if (!req.user.isAdmin || currentUserId !== req.params.userId) {
    return next(errorHandler(403, "You are not authorized to update this post!"));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};