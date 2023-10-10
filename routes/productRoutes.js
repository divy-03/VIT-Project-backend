const express = require("express");
const router = express.Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  getAllSortedProducts,
  getAllListing,
} = require("../controllers/productController");
const { fetchUser } = require("../middleware/auth");

router.route("/products/sort/:order").get(getAllSortedProducts);
router.route("/products/my/:user").get(getAllListing);
router.route("/product/new").post(createProduct);
router
  .route("/product/:id")
  .get(getProductDetails)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
