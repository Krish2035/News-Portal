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

// The full path will be: /api/user/signout
router.post("/signout", signout);

router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.get("/getusers", verifyToken, getUsers);
router.get("/:userId", getUserById);

export default router;