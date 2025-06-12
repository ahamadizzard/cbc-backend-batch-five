import {
  createUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserByEmail,
} from "../controllers/userController.js";

import express from "express";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/", getAllUsers);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.get("/:email", getUserByEmail);

export default userRouter;
