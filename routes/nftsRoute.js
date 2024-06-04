const express = require("express");
const {
  getAllNfts,
  createNFT,
  getSingleNFT,
  updateNFT,
  deleteNFT,
  checkId,
  checkBody,
} = require("../controllers/nftControllers");

const router = express.Router();

router.param("id", checkId);

//CRUD ITEMS
router.route("/").get(getAllNfts).post(checkBody, createNFT);

router.route("/:id").get(getSingleNFT).patch(updateNFT).delete(deleteNFT);

module.exports = router;
