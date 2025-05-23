import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import productRouter from "./routes/productRouter.js"; // import productRouter
import userRouter from "./routes/userRouter.js"; // import userRouter
import orderRouter from "./routes/orderRouter.js"; // import orderRouter
import reviewRouter from "./routes/reviewRouter.js"; // import reviewRouter
import jwt from "jsonwebtoken";
import cors from "cors";

dotenv.config(); // load environment variables from .env file
const PORT = process.env.PORT || 5000; // set port to environment variable or 5000 if not set

const app = express(); // create express app
app.use(cors()); // enable CORS for all routes
app.use(bodyParser.json()); // parse json bodies

// Middleware to check if the user is authenticated
// This middleware will run for every request
app.use((req, res, next) => {
  const tokenString = req.header("Authorization");
  // const token = tokenString.split(" ")[1]; // split the token string by space and get the second element
  if (tokenString != null) {
    const token = tokenString.replace("Bearer ", "");
    // console.log(token);
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decoded) => {
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

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/reviews", reviewRouter);

// start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
