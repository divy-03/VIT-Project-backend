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
  image1: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
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
  rating: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "User not found"],
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        max: [5, "rating cannot exceed 5"],
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter category"],
  },
  wishListed: {
    type: Boolean,
    required: true,
    default: false,
  },
  stock: {
    type: Number,
    required: true,
    default: 1,
    maxLength: [4, "Stock cannot exceed 4 digits"],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
