const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logOutUser,
} = require("../controllers/userController");

router.route("/auth/register").post(registerUser);
router.route("/auth/login").post(loginUser);
router.route("/auth/logout").get(logOutUser);

module.exports = router;
