import express from "express";
import {
  deleteProduct,
  getProduct,
  createProduct,
  updateProduct,
  getProductById,
  searchProducts,
} from "../controllers/productController.js";

// create a new router instance
const productRouter = express.Router();
productRouter.get("/", getProduct);
productRouter.post("/", createProduct);
productRouter.delete("/:productId", deleteProduct);
productRouter.put("/:productId", updateProduct);
productRouter.get("/:productId", getProductById);
productRouter.get("/search/:query", searchProducts);

// export the router instance
export default productRouter;
