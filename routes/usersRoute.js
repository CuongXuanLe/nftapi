const express = require("express");

const {
  signup
} = require("../controllers/authController");

const {
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/signup", signup)

//CRUD USERS
router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").get(getSingleUser).patch(updateUser).delete(deleteUser);

module.exports = router;
