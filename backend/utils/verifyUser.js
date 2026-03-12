import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  // 1. Extract the token from cookies
  // Ensure 'cookie-parser' is initialized in index.js before routes
  const token = req.cookies?.access_token;

  // 2. Check if the token exists
  if (!token) {
    console.error(
      "Auth Error: No access_token found. Ensure credentials: true is set in fetch/axios.",
    );
    return next(errorHandler(401, "Unauthorized: No token provided."));
  }

  // 3. Verify the token using your JWT_SECRET
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Error:", err.message);

      // Handle specific expired token case
      if (err.name === "TokenExpiredError") {
        return next(errorHandler(401, "Token expired. Please log in again."));
      }

      return next(errorHandler(401, "Unauthorized: Invalid token."));
    }

    // 4. Attach decoded user data (id, isAdmin) to the request object
    // This allows controllers to check if (req.user.isAdmin)
    req.user = user;

    // 5. Success - Move to the next middleware or controller
    next();
  });
};
