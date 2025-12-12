import express from "express";
import { handleSignup, handleLogin } from "../Controllers/userController.js";

const router = express.Router();

router.post("/signup", handleSignup);
router.post("/login", handleLogin);
// router.post("/logout", );

export default router;
