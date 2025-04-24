import express from "express";
import { createReview, getReviews } from "../controllers/reviewController.js"; // import review controller functions

const reviewRouter = express.Router(); // create a new router instance
reviewRouter.post("/", createReview); // define a route for POST requests to the root path
reviewRouter.get("/", getReviews); // define a route for GET requests to the root path

export default reviewRouter; // export the router instance
