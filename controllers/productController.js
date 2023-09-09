const Product = require("../models/productModel");
const resError = require("../tools/resError");
const resSuccess = require("../tools/resSuccess");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Getting all the products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  // Find all products in the database
  const products = await Product.find();

  // After finding all the products
  res.status(200).json({
    success: true,
    products,
  });
});

// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return resError(404, "Product not found", res);
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Create Product
exports.createProduct = catchAsyncErrors(async (req, res) => {
  // create product using the fields in the body
  const product = await Product.create(req.body);

  // show the product, i.e., created
  res.status(201).json({
    success: true,
    product,
  });
});

// Update Product Details
exports.updateProduct = catchAsyncErrors(async (req, res) => {
  // Find product by its id given in the parameters
  let product = await Product.findById(req.params.id);

  // If not found show error
  if (!product) {
    return resError(404, "Product not found", res);
  }

  // Then update the product with the given fields in the request body
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // And show the updated product details
  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product
exports.deleteProduct = catchAsyncErrors(async (req, res) => {
  // Find product by its id given in the parameters
  const product = await Product.findById(req.params.id);

  // If not found show error
  if (!product) {
    return resError(404, "Product not found", res);
  }

  // Delete the one produt, i.e., found by the id
  await product.deleteOne();

  // Show the success message
  resSuccess(200, "Product deleted successfully", res);
});
