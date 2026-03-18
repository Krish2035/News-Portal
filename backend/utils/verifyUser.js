import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  /**
   * 1. EXTRACTION & CONFIG CHECK
   * If req.cookies is undefined, it means app.use(cookieParser()) 
   * is missing in your index.js.
   */
  if (!req.cookies) {
    console.error("MIDDLEWARE ERROR: cookie-parser is not initialized in index.js");
    return next(errorHandler(500, "Internal Server Configuration Error"));
  }

  const token = req.cookies.access_token;

  /**
   * 2. EXISTENCE CHECK
   * If the token is missing, the user is not logged in or 
   * 'credentials: include' was missing in the frontend fetch.
   */
  if (!token) {
    return next(errorHandler(401, "Unauthorized: Access denied."));
  }

  /**
   * 3. JWT VERIFICATION
   * Using the secret to decode the payload (id, isAdmin, etc.)
   */
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT VERIFICATION FAILED:", err.message);

      // Handle specific expiration to prompt a fresh login
      if (err.name === "TokenExpiredError") {
        return next(errorHandler(401, "Session expired. Please sign in again."));
      }

      return next(errorHandler(401, "Unauthorized: Invalid or manipulated token."));
    }

    /**
     * 4. ATTACH DATA
     * Attaching the decoded payload to 'req.user' so that
     * routes like /api/user/update can access req.user.id
     */
    req.user = user;

    // 5. PROCEED
    next();
  });
};