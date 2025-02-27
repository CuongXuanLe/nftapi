const NFT = require("../models/nftModel");
const APIFeatures = require("../Utils/apiFeatures");
const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/appError");

//GET TOP 5
exports.aliasTopNFTs = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,difficulty";
  next();
};

//GET REQUEST
exports.getAllNfts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(NFT.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const nfts = await features.query;

  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    results: nfts.length,
    data: {
      nfts: nfts,
    },
  });
});

//POST REQUEST
exports.createNFT = catchAsync(async (req, res, next) => {
  const newNFT = await NFT.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      nft: newNFT,
    },
  });
});

//GET SINGLE NFT
exports.getSingleNFT = catchAsync(async (req, res, next) => {
  const nft = await NFT.findById(req.params.id);

  if (!nft) {
    return next(new AppError("No nft found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      nft,
    },
  });
});

//PATCH METHOD
exports.updateNFT = catchAsync(async (req, res, next) => {
  const nft = await NFT.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!nft) {
    return next(new AppError("No nft found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      nft,
    },
  });
});

//DELETE METHOD
exports.deleteNFT = catchAsync(async (req, res, next) => {
  const nft = await NFT.findByIdAndDelete(req.params.id);

  if (!nft) {
    return next(new AppError("No nft found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

//Aggr
exports.getNFTsStats = catchAsync(async (req, res, next) => {
  const stats = await NFT.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: "$ratingsAverage",
        _id: { $toUpper: "$difficulty" },
        numNFT: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avaPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgRating: 1 },
    },
    {
      $match: {
        _id: { $ne: "EASY" },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

//calculating number of nft create in a month or monthly plan
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await NFT.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numNFTStarts: { $sum: 1 },
        nfts: { $push: "$name" },
      },
    },
    {
      $addFields: {
        month: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numNFTStarts: -1,
      },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: "success",
    data: plan,
  });
});
