import express from "express";
import {
  deleteProduct,
  getProduct,
  createProduct,
  updateProduct,
  getProductById,
} from "../controllers/productController.js";

const productRouter = express.Router(); // create a new router instance
productRouter.get("/", getProduct); // define a route for GET requests to the root path
productRouter.post("/", createProduct); // define a route for POST requests to the root path
productRouter.delete("/:productId", deleteProduct); // define a route for DELETE requests to the root path
productRouter.put("/:productId", updateProduct); // define a route for PUT requests to the root path
productRouter.get("/:productId", getProductById); // define a route for GET requests to the root path with productId as a parameter

export default productRouter; // export the router instance
