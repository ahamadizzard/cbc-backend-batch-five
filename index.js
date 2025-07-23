import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import productRouter from "./routes/productRouter.js";
import userRouter from "./routes/userRouter.js";
import orderRouter from "./routes/orderRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import jwt from "jsonwebtoken";
import cors from "cors";

dotenv.config(); // load environment variables from .env file
const app = express(); // create express app
const PORT = process.env.PORT || 5000; // set port to environment variable or 5000 if not set

// Allow requests from your Vercel frontend's domain
const allowedOrigins = [
  "https://central-beauty-cosmetics.vercel.app/", // Replace with your actual Vercel domain
  "http://localhost:3000", // Keep this for local development if your frontend runs on 3000
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // If you're sending cookies or authorization headers
};

app.use(cors(corsOptions));
app.use(bodyParser.json()); // parse json bodies

// Middleware to check if the user is authenticated
// This middleware will run for every request
// JWT Authentication Middleware
app.use((req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return next();

  const token = authHeader.replace("Bearer ", "");

  jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
});

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/orders", orderRouter);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
