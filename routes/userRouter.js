import express from "express";
import {
  createUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserByEmail,
  loginWithGoogle,
  sendOTP,
  resetPassword,
  getCurrentUser,
} from "../controllers/userController.js";

const router = express.Router();

// Authentication routes
router.post("/", createUser);
router.post("/login", loginUser);
router.post("/login/google", loginWithGoogle);

// Password recovery routes
router.post("/send-otp", sendOTP);
router.post("/reset-password", resetPassword);

// User routes (protected)
router.get("/", getAllUsers);
router.get("/me", getCurrentUser);
router.get("/:email", getUserByEmail);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
