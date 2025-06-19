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
} from "../controllers/userController.js";

import express from "express";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/", getAllUsers);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.get("/:email", getUserByEmail);
userRouter.post("/login/google", loginWithGoogle);
userRouter.post("/send-otp", sendOTP);
userRouter.post("/reset-password", resetPassword);

export default userRouter;
