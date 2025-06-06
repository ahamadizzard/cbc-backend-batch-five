import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

export async function createOrder(req, res) {
  // get user information
  if (req.user == null) {
    //only logged-in users can create orders
    res.status(403).json({
      message: "Please login and try again",
    });
    return;
  }

  const orderInfo = req.body;
  //check for the name in the orderInfo
  if (orderInfo.name == null) {
    orderInfo.name = req.user.firstName + " " + req.user.lastName;
  }

  //Generate orderId
  let orderId = "CBC00001";

  //this will give  the last order in the database
  //this will return an array of objects, so we need to get the first object
  const lastOrder = await Order.find().sort({ date: -1 }).limit(1);

  //if there are no orders in the database, create the first order
  if (lastOrder.length > 0) {
    //get the last orderId and increment it by 1
    const lastOrderId = lastOrder[0].orderId;
    //method 1
    // const lastOrderNumber = parseInt(lastOrderId.substring(3));
    //method 2 // CBC00001 -> 00001 -> 1
    const lastOrderNumberString = lastOrderId.replace("CBC", "");
    //get the last order number and increment it by 1
    const lastOrderNumber = parseInt(lastOrderNumberString);
    const newOrderNumber = lastOrderNumber + 1;
    const newOrderNumberString = String(newOrderNumber).padStart(5, "0"); // 00002
    orderId = "CBC" + newOrderNumberString; // CBC00002
  }

  try {
    let total = 0;
    let labelledTotal = 0;
    const products = [];

    for (let i = 0; i < orderInfo.products.length; i++) {
      const item = await Product.findOne({
        productId: orderInfo.products[i].productId,
      });
      // }); //check if the product exists
      if (item == null) {
        res.status(404).json({
          message:
            "Product with productId " +
            orderInfo.products[i].productId +
            " not found",
        });
        return;
      }
      //check if the product is available
      if (item.isAvailable == false) {
        res.status(404).json({
          message:
            "Product with productId " +
            orderInfo.products[i].productId +
            " is not available at the moment",
        });
        return;
      }
      //check if the product is in stock
      if (item.stock < orderInfo.products[i].quantity) {
        res.status(404).json({
          message: "Product out of stock",
        });
        return;
      }
      // arrange the productInfo details
      products[i] = {
        productInfo: {
          productId: item.productId,
          productName: item.productName,
          altNames: item.altNames,
          productDescription: item.productDescription,
          productImages: item.productImages,
          labelPrice: item.labelPrice,
          salePrice: item.salePrice,
        },
        quantity: orderInfo.products[i].quantity,
      };
      //calculate the total price of the product
      const price = item.salePrice * orderInfo.products[i].quantity;
      //total price of the order
      total += price;
      //labelled total price of the order
      labelledTotal += item.labelPrice * orderInfo.products[i].quantity;
    }

    //final order creating data
    const order = new Order({
      orderId: orderId,
      email: req.user.email,
      name: orderInfo.name,
      address: orderInfo.address,
      phone: orderInfo.phone,
      products: products,
      labelledTotal: labelledTotal,
      total: total,
    });
    //save the order to the database
    const createdOrder = await order.save();

    // check if the order is created successfully
    res.json({
      message: "Order created successfully",
      order: createdOrder,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating order",
      error: err,
    });
  }

  // add current users name if not provided
  // add current users email if not provided
  // Generate orderId
  // create order object
  // check the stock availability of the products in the order
}

export async function getOrders(req, res) {
  if (req.user == null) {
    res.status(403).json({
      message: "Please login and try again",
    });
    return;
  }
  try {
    if (req.user.role == "admin") {
      const orders = await Order.find();
      res.json(orders);
    } else {
      const orders = await Order.find({ email: req.user.email });
      res.json(orders);
    }
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving orders",
      error: error,
    });
  }
}
