import Review from "../models/reviewModel.js";
import { isAdmin } from "./userController.js";

export async function createReview(req, res) {
  // get user information
  if (req.user == null) {
    //only logged-in users can create orders
    res.status(403).json({
      message: "Please login and try again",
    });
    return;
  }
  const reviewInfo = req.body;
  //check for the name in the reviewInfo
  if (reviewInfo.name == null) {
    reviewInfo.name = req.user.firstName + " " + req.user.lastName;
  }
  //Generate reviewId
  let reviewId = "0001";
  //this will give  the last review in the database
  const lastReview = await Review.find().sort({ _id: -1 }).limit(1);
  if (lastReview.length > 0) {
    const lastReviewId = lastReview[0].reviewId;
    //get the last reviewId and increment it by 1
    reviewId = lastReviewId + 1;
  }
  // Create a new review object
  const review = new Review({
    reviewId: reviewId,
    productId: reviewInfo.productId,
    name: reviewInfo.name,
    userImage: reviewInfo.userImage,
    rating: reviewInfo.rating,
    reviewText: reviewInfo.reviewText,
    reviewImages: reviewInfo.reviewImages,
    reviewDate: reviewInfo.reviewDate,
    // when the review is created, we keep it is visible by default
    // admin can change this visibility
    isVisible: true,
  });
  try {
    // Save the review to the database
    await review.save();
    res.status(201).json({
      message: "Review created successfully",
      reviewId: review.reviewId,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

//this code is for admin user to view all reviews
export async function getReviews(req, res) {
  try {
    // if (isAdmin(req)) {
    // If the user is an admin, return all reviews
    const reviews = await Review.find();
    res.json(reviews);
    // return;
    // }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

// get reviews by rating is greater than 3
export async function getReviewsByRating(req, res) {
  try {
    // if (isAdmin(req)) {
    // If the user is an admin, return all reviews
    const reviews = await Review.find();
    res.json(reviews);
    // return;
    // }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}
// export async function getReviewsByRating(req, res) {
//   try {
//     console.log("GET /all called");
//     const reviews = await Review.find();
//     console.log("Returned reviews count:", reviews.length);
//     res.json(reviews);
//   } catch (error) {
//     console.error("Error fetching reviews:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

// try {
//   if (isAdmin(req)) {
//     const reviews = await Review
//       .find
//       // {
//       // rating: { $gt: 3 },
//       // isVisible: true,
//       // }
//       ();
//     // console.log(reviews);
//     res.json(reviews);
//   }
// } catch (error) {
//   console.error("Error fetching reviews:", error);
//   res.status(500).json({ message: "Internal server error" });
//   return;
// }
// }

// get review by productId
export async function getReviewByProductId(req, res) {
  try {
    const productId = req.params.productId;
    const reviews = await Review.find({
      productId: productId,
      isVisible: true,
    });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

// export async function getReviewsByRating(req, res) {
//   try {
//     const all = await Review.find({}); // get everything
//     console.log("Total reviews:", all.length);

//     const filtered = await Review.find({
//       rating: { $gt: 3 },
//       isVisible: true,
//     });
//     console.log("Filtered reviews:", filtered.length);

//     res.json(filtered);
//   } catch (error) {
//     console.error("Error fetching reviews:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

// this code is to convert the date to local time
// const localDate = new Date(review.reviewDate).toLocaleString('en-US', {
//   timeZone: 'Asia/Colombo', // Replace with your timezone, e.g., 'America/New_York'
// });
// console.log(localDate); // Shows time in your region.
