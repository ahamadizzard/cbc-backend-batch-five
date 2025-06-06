import {
  createUser,
  loginUser,
  getAllUsers,
} from "../controllers/userController.js";

import express from "express";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/", getAllUsers);

export default userRouter;
