import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryId: {
    type: String,
    required: true,
    unique: true,
  },
  categoryName: {
    type: String,
    required: true,
  },
  categoryDescription: {
    type: String,
    required: true,
  },
  categoryImage: {
    type: String,
    required: true,
  },
});
export default mongoose.model("category", categorySchema);
