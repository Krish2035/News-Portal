import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const updateUser = async (req, res, next) => {
  // Authorization Check
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You can only update your own account!"));
  }

  const updateData = {};

  // Handle Password
  if (req.body.password) {
    if (req.body.password.length < 8) {
      return next(errorHandler(400, "Password must be at least 8 characters"));
    }
    updateData.password = bcryptjs.hashSync(req.body.password, 10);
  }

  // Handle Username
  if (req.body.username) {
    const username = req.body.username.toLowerCase();
    if (username.length < 5 || username.length > 20) {
      return next(errorHandler(400, "Username must be 5-20 characters"));
    }
    if (username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return next(errorHandler(400, "Letters and numbers only"));
    }
    updateData.username = username;
  }

  // Handle Email
  if (req.body.email) {
    updateData.email = req.body.email;
  }

  // Handle Profile Picture
  if (req.body.profilePicture) {
    updateData.profilePicture = req.body.profilePicture;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return next(errorHandler(404, "User not found"));

    const { password, ...rest } = updatedUser.toObject();
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not authorized to delete this user"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

/**
 * PRODUCTION READY SIGNOUT
 * For Vercel, secure must be true and sameSite must be 'none' 
 * to allow cross-origin cookie clearing.
 */
export const signout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token", {
        httpOnly: true,
        secure: true, // Always true for HTTPS (Vercel)
        sameSite: "none", // Required for cross-site cookie handling
        path: "/",
      })
      .status(200)
      .json("User has been logged out successfully!");
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) return next(errorHandler(403, "Admin only resource"));
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((u) => {
      const { password, ...rest } = u.toObject();
      return rest;
    });

    const totalUsers = await User.countDocuments();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const lastMonthUsers = await User.countDocuments({ 
      createdAt: { $gte: oneMonthAgo } 
    });

    res.status(200).json({ 
      users: usersWithoutPassword, 
      totalUsers, 
      lastMonthUsers 
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return next(errorHandler(404, "User not found!"));
    const { password, ...rest } = user.toObject();
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};