import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// SIGNUP CONTROLLER
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username.trim() === "" ||
    email.trim() === "" ||
    password.trim() === ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    next(error);
  }
};

// SIGNIN CONTROLLER
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email.trim() === "" || password.trim() === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const validPassword = await bcryptjs.compare(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Wrong Credentials"));
    }

    // Ensure JWT_SECRET exists to prevent server crash
    if (!process.env.JWT_SECRET) {
      return next(
        errorHandler(500, "JWT_SECRET is missing from server configuration"),
      );
    }

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET,
    );

    // Convert to plain object to safely remove password
    const { password: pass, ...rest } = validUser.toObject();

    return res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// GOOGLE AUTH CONTROLLER
export const google = async (req, res, next) => {
  const { email, name, profilePhotoUrl } = req.body;

  try {
    // Check if secret exists before proceeding
    if (!process.env.JWT_SECRET) {
      return next(errorHandler(500, "JWT_SECRET is missing"));
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create user if they don't exist
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(generatedPassword, 10);

      user = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: profilePhotoUrl,
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
    );

    const { password: pass, ...rest } = user.toObject();

    return res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
