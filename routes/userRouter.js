import { createUser, loginUser } from "../controllers/userController.js";

import express from "express";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
// userRouter.get("/users", (req, res) => {
//   res.send("Get all users");
// });
// userRouter.get("/users/:id", (req, res) => {
//   res.send(`Get user with ID: ${req.params.id}`);
// });

export default userRouter;
