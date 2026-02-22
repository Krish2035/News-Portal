import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  // 1. Extract the token from cookies
  const token = req.cookies.access_token;

  // 2. Debugging: Check if the cookie actually arrived at the server
  if (!token) {
    console.log("Authorization Failed: No access_token found in cookies.");
    return next(errorHandler(401, "Unauthorized: Please log in again."));
  }

  // 3. Verify the token using your JWT_SECRET
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("JWT Verification Error:", err.message);
      return next(errorHandler(401, "Unauthorized: Invalid or expired token."));
    }

    // 4. Attach the decoded user data (id, isAdmin) to the request object
    req.user = user;

    // 5. Pass control to the next function (the controller)
    next();
  });
};
