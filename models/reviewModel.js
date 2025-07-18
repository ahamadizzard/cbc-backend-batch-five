import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  reviewId: {
    type: Number,
    required: true,
    unique: true,
    AutoIncrement: true,
  },
  productId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  userImage: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },

  reviewText: {
    type: String,
  },
  reviewImages: [
    {
      type: String,
    },
  ],
  reviewDate: {
    type: Date,
    default: Date.now,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
});
const Review = mongoose.model("review", reviewSchema);
export default Review;
