import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

// --- 1. CREATE POST ---
export const create = async (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return next(errorHandler(403, "Admin only access!"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Title and Content are required!"));
  }

  const slug = req.body.title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .join("-") + "-" + Math.random().toString(36).slice(-4);

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

// --- 2. GET POSTS (Optimized for Search) ---
export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const query = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && req.query.category !== 'uncategorized' && { category: req.query.category }),
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

    const totalPosts = await Post.countDocuments(query);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const lastMonthPosts = await Post.countDocuments({
      ...query,
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

// --- 3. DELETE POST ---
export const deletepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "Unauthorized deletion attempt!"));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    next(error);
  }
};

// --- 4. UPDATE POST ---
export const updatepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "Unauthorized update attempt!"));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      { $set: { ...req.body } },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};