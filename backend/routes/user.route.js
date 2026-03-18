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

// POST: /api/user/signout
router.post("/signout", signout);

// PUT: /api/user/update/:userId
router.put("/update/:userId", verifyToken, updateUser);

// DELETE: /api/user/delete/:userId
router.delete("/delete/:userId", verifyToken, deleteUser);

// GET: /api/user/getusers
router.get("/getusers", verifyToken, getUsers);

// GET: /api/user/:userId (Keep this last to avoid catching other routes)
router.get("/:userId", getUserById);

export default router;