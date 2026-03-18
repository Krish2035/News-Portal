import express from "express";
import { google, signin, signup } from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * --- AUTH ROUTES ---
 * Base path: /api/auth
 */

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);

export default router;