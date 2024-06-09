const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userModel");
const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/appError");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  //   passwordConfirm: req.body.passwordConfirm,
  // });

  const newUser = await User.create(req.body);

  const token = signToken(newUser._id);
  console.log("Login token: " + token);
  res.status(201).json({
    status: "Success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide your email and password"));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect password", 401));
  }

  const token = signToken(user.id);
  console.log(token, "---", user);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in to get access", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log("decoded", decoded);
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError("The User belonging to this token no longer exists", 401)
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("User recently changed password", 401));
  }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You have not access to delete NFT"), 403);
    }
    next();
  };
};
