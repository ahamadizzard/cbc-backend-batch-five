import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
  },

  productName: {
    type: String,
    required: true,
  },
  altNames: [
    {
      type: String,
    },
  ],
  productCategory: {
    type: String,
    required: true,
  },
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
  stock: {
    type: Number,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

const Product = mongoose.model("product", productSchema);

export default Product;
