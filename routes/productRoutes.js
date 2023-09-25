const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  getAllSortedProducts,
} = require("../controllers/productController");

router.route("/products").get(getAllProducts);
router.route("/products/sort/:order").get(getAllSortedProducts);
router.route("/product/new").post(createProduct);
router
  .route("/product/:id")
  .get(getProductDetails)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
