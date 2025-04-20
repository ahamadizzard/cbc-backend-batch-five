import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  }, // CBC0003
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "pending",
  },
  labelledTotal: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  products: [
    {
      productInfo: {
        productId: {
          type: String,
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        altNames: [
          {
            type: String,
            required: true,
          },
        ],
        productDescription: {
          type: String,
          required: true,
        },
        productImages: [
          {
            type: String,
          },
        ],
        labelPrice: {
          type: Number,
          required: true,
        },
        salePrice: {
          type: Number,
          required: true,
        },
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
});
const Order = mongoose.model("order", orderSchema);
export default Order;
