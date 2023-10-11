const Product = require("../models/productModel");
const resError = require("../tools/resError");
const resSuccess = require("../tools/resSuccess");
const bubbleSort = require("../utils/bubbleSort.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

// Get All Products (asc/desc/time)
exports.getAllSortedProducts = catchAsyncErrors(async (req, res) => {
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  const products = await apiFeature.query;

  // Sequence is the order in which products are sorted
  const order = req.params.order;

  let productCount;
  if (req.query.keyword === "" && req.query.category === "") {
    productCount = await Product.countDocuments();
  } else {
    productCount = products.length;
  }

  // Sorting products ascending to the price
  bubbleSort(products, order);

  // After finding all the products
  res.status(200).json({
    success: true,
    products,
    productCount,
  });
});

exports.getAllListing = catchAsyncErrors(async (req, res) => {
  const user = req.params.user;

  const products = await Product.find({ user });

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
  // Because having problem in cookies using other id directly from the body
  // req.body.user = req.user.id;
  // req.body.user = req.body.id;

  // const myCloud = await cloudinary.v2.uploader.upload(image1, {
  //   folder: "products",
  //   width: 250,
  //   crop: "scale",
  // });

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

exports.createReview = catchAsyncErrors(async (req, res) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user.id,
    rating: Number(rating),
    comment: comment || "",
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user.id.toString()
  );

  if (isReviewed) {
    // update existing review with new data

    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user.id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg = avg + rev.rating;
  });
  product.reviews.forEach((rev) => {
    avg = avg + rev.rating;
  });
  product.rating = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  resSuccess(200, "Reviewed Item Successfully", res);
});

exports.getAllReviews = catchAsyncErrors(async (req, res) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return resError(404, "Product not found", res);
  }

  return res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

exports.deleteReview = catchAsyncErrors(async (req, res) => {
  const productId = req.query.id;
  const reviewId = req.query.reviewId;

  const product = await Product.findById(productId);

  if (!product) {
    return resError(404, "Product not found", res);
  }

  const reviewIndex = product.reviews.findIndex(
    (rev) => rev._id.toString() === reviewId
  );

  if (reviewIndex === -1) {
    return resError(404, "Review not found", res);
  }

  product.reviews.pull({ _id: reviewId });

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.rating = avg / product.reviews.length;

  // Update the number of reviews
  product.numOfReviews = product.reviews.length;

  // Save the updated reviews
  await product.save({ validateBeforeSave: false });

  return resSuccess(200, "Review deleted successfully", res);
});
