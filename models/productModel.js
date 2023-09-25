const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  priceType: {
    type: String,
    required: true,
  },
  minPrice: {
    type: Number,
  },
  maxPrice: {
    type: Number,
  },
  fixedPrice: {
    type: Number,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter category"],
  },
  stock: {
    type: Number,
    required: true,
    default: 1,
    maxLength: [4, "Stock cannot exceed 4 digits"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
