const express = require("express");
const {
  getAllNfts,
  createNFT,
  getSingleNFT,
  updateNFT,
  deleteNFT,
  aliasTopNFTs,
  getNFTsStats,
  getMonthlyPlan,
  checkId,
  checkBody,
} = require("../controllers/nftControllers");

const {
  signup,
  login,
  protect,
  restrictTo,
} = require("../controllers/authController");

const router = express.Router();
// router.param("id", checkId);

//Display top 5 nfts by price
router.route("/top-5-nfts").get(aliasTopNFTs, getAllNfts);

//STATS route
router.route("/nfts-stats").get(getNFTsStats);

//GET monthly plan
router.route("/monthly-plan/:year").get(getMonthlyPlan);

//CRUD ITEMS
router.route("/").get(protect, getAllNfts).post(createNFT);

router
  .route("/:id")
  .get(getSingleNFT)
  .patch(updateNFT)
  .delete(protect, restrictTo("admin", "guide"), deleteNFT);

module.exports = router;
