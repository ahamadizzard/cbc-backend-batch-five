import {
  createOrder,
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import express from "express";

const orderRouter = express.Router(); // create a new router instance
orderRouter.post("/", createOrder); // define a route for POST requests to the root path
orderRouter.get("/", getOrders); // define a route for GET requests to the root path
orderRouter.put("/:orderId/:status", updateOrderStatus); // define a route for PUT requests to the path with an orderId and status parameter

export default orderRouter; // export the router instance
