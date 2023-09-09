const Product = require("../models/productModel");

exports.getAllProducts = (req, res) => {
  res.status(200).json({ message: "Route working fine" });
};

exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
};
