import { createOrder } from "../controllers/orderController.js";
import express from "express";

const orderRouter = express.Router(); // create a new router instance
orderRouter.post("/", createOrder); // define a route for POST requests to the root path

export default orderRouter; // export the router instance
