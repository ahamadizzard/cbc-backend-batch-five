import Product from "../models/productModel.js";
import { isAdmin } from "./userController.js";

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
