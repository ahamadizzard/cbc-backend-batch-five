import express from "express";
import {
  createReview,
  getReviews,
  getReviewByProductId,
  getReviewsByRating,
} from "../controllers/reviewController.js";
import { isAdmin } from "../controllers/userController.js";

const reviewRouter = express.Router();
reviewRouter.post("/", isAdmin, createReview);
reviewRouter.get("/all", getReviewsByRating);
reviewRouter.get("/", getReviews);
reviewRouter.get("/:productId", getReviewByProductId);

export default reviewRouter; // export the router instance
