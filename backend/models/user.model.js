import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,      // Ensures no two users have the same handle
      lowercase: true,   // Automatically saves 'Krish' as 'krish'
      trim: true,        // Removes leading/trailing spaces (' krish ' -> 'krish')
    },
    email: {
      type: String,
      required: true,
      unique: true,      // Prevents multiple accounts with one email
      index: true,       // CRITICAL: Speeds up login/search queries significantly
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/128/456/456212.png",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { 
    // Automatically manages createdAt and updatedAt fields
    timestamps: true 
  }
);

/**
 * Creates the User model. 
 * Mongoose will automatically look for a collection named 'users' in MongoDB.
 */
const User = mongoose.model("User", userSchema);

export default User;