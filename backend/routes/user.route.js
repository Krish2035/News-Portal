import express from "express";
import { 
    deleteUser, 
    getUserById, 
    getUsers, 
    signout, 
    updateUser 
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Path: /api/user/signout
router.post("/signout", signout);

// Path: /api/user/update/:userId
router.put("/update/:userId", verifyToken, updateUser);

// Path: /api/user/delete/:userId
router.delete("/delete/:userId", verifyToken, deleteUser);

// Path: /api/user/getusers
router.get("/getusers", verifyToken, getUsers);

/**
 * EXPRESS 5 COMPATIBILITY:
 * In Express 5, ensure ":userId" is a clean string.
 * If you ever need to match sub-paths here, you would use "/:userId/:path*"
 */
router.get("/:userId", getUserById);

export default router;