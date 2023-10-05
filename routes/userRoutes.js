const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logOutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getUser,
  editUserRole,
  deleteUser,
} = require("../controllers/userController");
const { fetchUser, authRole } = require("../middleware/auth");

router.route("/auth/register").post(registerUser);
router.route("/auth/login").post(loginUser);
router.route("/auth/logout").get(fetchUser, logOutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(fetchUser, updatePassword);
router.route("/me").get(fetchUser, getUserDetails);
router.route("/me/update").put(fetchUser, updateProfile);
router.route("/admin/users").get(fetchUser, authRole("admin", "owner"), getAllUsers);
router.route("/admin/user/:id").get(fetchUser, authRole("admin", "owner"), getUser);
router.route("/admin/user/:id").put(fetchUser, authRole("owner"), editUserRole);
router.route("/admin/user/:id").delete(fetchUser, authRole("admin", "owner"), deleteUser);

module.exports = router;
