const NFT = require("../models/nftModel");

//GET REQUEST
exports.getAllNfts = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = NFT.find(JSON.parse(queryStr));

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__V");
    }

    const nfts = await query;

    // const nfts = await NFT.find({
    //   difficulty: "easy",
    //   // duration: 5,
    // });

    // const nfts = await NFT.find()
    //   .where("duration")
    //   .equals(5)
    //   .where("difficulty")
    //   .equals("easy");

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
      message: "Invalid data send NFT",
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
