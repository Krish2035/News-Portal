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
    username === "" ||
    email === "" ||
    password === ""
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
    res.json("Signup successful");
  } catch (error) {
    next(error);
  }
};

// SIGNIN CONTROLLER
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
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

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET,
    );

    const { password: pass, ...rest } = validUser._doc;

    // FIX: Added sameSite: 'lax' and secure: false for local development compatibility
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // Ensure this is false on localhost (HTTP)
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
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
      );

      const { password: pass, ...rest } = user._doc;

      // FIX: Added sameSite: 'lax' for Google sign-in cookies
      return res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
        })
        .json(rest);
    }

    // If user doesn't exist, create a new one
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    const hashedPassword = await bcryptjs.hash(generatedPassword, 10);

    const newUser = new User({
      username:
        name.toLowerCase().split(" ").join("") +
        Math.random().toString(9).slice(-4),
      email,
      password: hashedPassword,
      profilePicture: profilePhotoUrl,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET,
    );

    const { password: pass, ...rest } = newUser._doc;

    // FIX: Added sameSite: 'lax' for new Google user cookies
    return res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};