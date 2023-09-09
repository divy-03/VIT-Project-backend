const Product = require("../models/productModel");
const resError = require("../tools/resError");
const resSuccess = require("../tools/resSuccess");

exports.getAllProducts = async (req, res) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
};

exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
};

exports.updateProduct = async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return resError(404, "Product not found", res);
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
};
