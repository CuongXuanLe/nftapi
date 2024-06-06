const NFT = require("../models/nftModel");
const APIFeatures = require("../Utils/apiFeatures");

//GET TOP 5
exports.aliasTopNFTs = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,difficulty";
  next();
};

//GET REQUEST
exports.getAllNfts = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

//POST REQUEST
exports.createNFT = async (req, res) => {
  try {
    const newNft = await NFT.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        nft: newNft,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

//GET SINGLE NFT
exports.getSingleNFT = async (req, res) => {
  try {
    // console.log('check req: ',  req)
    const nft = await NFT.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        nft,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

//PATCH METHOD
exports.updateNFT = async (req, res) => {
  try {
    const nft = await NFT.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        nft,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

//DELETE METHOD
exports.deleteNFT = async (req, res) => {
  try {
    await NFT.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

//Aggr
exports.getNFTsStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

//calculating number of nft create in a month or monthly plan

exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
