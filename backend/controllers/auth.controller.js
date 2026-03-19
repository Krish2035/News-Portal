import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

/**
 * PRODUCTION FIX: 
 * Vercel and other platforms set NODE_ENV to production automatically.
 * We use this to ensure cookies work across different domains.
 */
const isProduction = process.env.NODE_ENV === "production";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password || !username.trim() || !email.trim() || !password.trim()) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({
      // Sanitize username: lowercase and no spaces
      username: username.toLowerCase().replace(/\s+/g, ""), 
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || !email.trim() || !password.trim()) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email: email.toLowerCase() });
    if (!validUser) return next(errorHandler(404, "User not found"));

    const validPassword = await bcryptjs.compare(password, validUser.password);
    if (!validPassword) return next(errorHandler(400, "Invalid credentials"));

    if (!process.env.JWT_SECRET) return next(errorHandler(500, "Server configuration error: JWT_SECRET missing"));

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin }, 
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser.toObject();

    res.status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        path: "/",
        // CRITICAL: Cross-site cookie settings for Vercel
        sameSite: isProduction ? "none" : "lax", 
        secure: isProduction, 
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, profilePhotoUrl } = req.body;
  try {
    if (!process.env.JWT_SECRET) return next(errorHandler(500, "JWT_SECRET is missing"));

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create secure random password for Google users
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(generatedPassword, 10);
      
      user = new User({
        username: name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
        email: email.toLowerCase(),
        password: hashedPassword,
        // Match this field name to your User Schema (usually profilePicture)
        profilePicture: profilePhotoUrl, 
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin }, 
      process.env.JWT_SECRET
    );
    
    const { password: pass, ...rest } = user.toObject();

    res.status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        path: "/",
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token", {
        path: "/",
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
      })
      .status(200)
      .json({ message: "User has been signed out" });
  } catch (error) {
    next(error);
  }
};