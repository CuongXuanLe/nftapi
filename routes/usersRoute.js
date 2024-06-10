const express = require("express");

const { signup, login, forgotPassword, resetPassword, protect, updatePassword} = require("../controllers/authController");

const {
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.patch("/updateMyPassword", protect, updatePassword);

router.patch("/updateMe", protect, updateMe);
router.delete("/deleteMe", protect, deleteMe);

//CRUD USERS
router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").get(getSingleUser).patch(updateUser).delete(deleteUser);

module.exports = router;
