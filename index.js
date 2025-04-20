import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import productRouter from "./routes/productRouter.js"; // import productRouter
import userRouter from "./routes/userRouter.js"; // import userRouter
import orderRouter from "./routes/orderRouter.js"; // import orderRouter
import jwt from "jsonwebtoken";

dotenv.config(); // load environment variables from .env file
const PORT = process.env.PORT || 5000; // set port to environment variable or 5000 if not set

const app = express(); // create express app

app.use(bodyParser.json()); // parse json bodies

// Middleware to check if the user is authenticated
// This middleware will run for every request
app.use((req, res, next) => {
  const tokenString = req.header("Authorization");
  // const token = tokenString.split(" ")[1]; // split the token string by space and get the second element
  if (tokenString != null) {
    const token = tokenString.replace("Bearer ", "");
    // console.log(token);
    jwt.verify(token, "cbc-batch-five#@2025", (err, decoded) => {
      if (decoded != null) {
        // console.log(decoded);
        req.user = decoded;
        next();
      } else {
        console.log("Invalid token");
        res.status(403).json({ message: "Invalid token" });
      }
    });
  } else {
    next();
  }
});

mongoose
  .connect(process.env.MONGODB_URI) // connect to MongoDB
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    // catch any errors
    console.log("Database Connection Error: ", error);
  });

app.use("/products", productRouter); // use productRouter for all routes starting with /products
app.use("/users", userRouter); // use userRouter for all routes starting with /users
app.use("/orders", orderRouter); // use orderRouter for all routes starting with /orders

// start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
