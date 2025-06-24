import Product from "../models/productModel.js";
import { isAdmin } from "./userController.js";
import Review from "../models/reviewModel.js";

export async function getProduct(req, res) {
  try {
    if (isAdmin(req)) {
      // If the user is an admin, return all products
      const products = await Product.find();

      res.json(products);
    } else {
      // If the user is not an admin, return only the available products
      const products = await Product.find({ isAvailable: true });
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
}

export async function getProductById(req, res) {
  const productId = req.params.productId;

  try {
    const product = await Product.findOne({ productId: productId });

    // Check if the product exists
    if (product == null) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    // Check if the product is available for sale
    if (!product.isAvailable && !isAdmin(req)) {
      // If the product is not available and the user is not an admin, return a 403 error
      res.status(403).json({
        success: false,
        message: "You are not authorized to view this product",
      });
      return;
    }
    const reviewFilter = { productId: productId };
    if (!isAdmin(req)) {
      // If the user is an admin, return all reviews for the product
      reviewFilter.isVisible = true; // Include only visible reviews
    }
    const reviews = await Review.find(reviewFilter);

    //this combines the product and review data into a single object
    // and sends it as a response
    res.json({
      success: true,
      product: {
        ...product._doc, // Product details
        reviews: reviews, // Attach reviews array
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
}

export function createProduct(req, res) {
  // Check if there is a logged-in user
  if (!isAdmin(req)) {
    res
      .status(403)
      .json({ message: "You are not authorized to create a product" });
    return;
  }
  const newProduct = new Product(req.body);

  newProduct
    .save()
    .then(() => {
      res.json({ message: "Product saved successfully" });
    })
    .catch((error) => {
      res.json({ message: "Error saving product", error });
    });
}

export async function deleteProduct(req, res) {
  if (!isAdmin(req)) {
    res
      .status(403)
      .json({ message: "You are not authorized to delete a product" });
    return;
  }
  try {
    await Product.deleteOne({ productId: req.params.productId });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
}

export async function updateProduct(req, res) {
  if (!isAdmin(req)) {
    res
      .status(403)
      .json({ message: "You are not authorized to update a product" });
    return;
  }

  // Extract the product ID from the request parameters
  const productId = req.params.productId;

  // Get the data to update from the request body
  const updatingData = req.body;

  try {
    await Product.updateOne({ productId: productId }, updatingData);

    res.json({ message: "Product updated successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error updating product",
      error: err,
    });
  }
}

export async function searchProducts(req, res) {
  const searchQuery = req.params.query;

  try {
    const products = await Product.find({
      $or: [
        { productName: { $regex: searchQuery, $options: "i" } },
        // this code being used for some complex search with multiple queries for arrays
        // { altNames: { $elemMatch: { $regex: searchQuery, $options: "i" } } },
        { altNames: { $regex: searchQuery, $options: "i" } },
      ],
      isAvailable: true,
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error searching products", error: error });
  }
}
