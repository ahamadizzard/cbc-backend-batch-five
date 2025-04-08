import express from "express";
import {
  deleteProduct,
  getProduct,
  createProduct,
} from "../controllers/productController.js";

const productRouter = express.Router(); // create a new router instance
productRouter.get("/", getProduct); // define a route for GET requests to the root path
productRouter.post("/", createProduct); // define a route for POST requests to the root path
productRouter.delete("/:productId", deleteProduct); // define a route for DELETE requests to the root path

export default productRouter; // export the router instance
