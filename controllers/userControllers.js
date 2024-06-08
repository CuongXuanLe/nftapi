const User = require("../models/userModel");
const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/appError");

// USERS
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getSingleUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
