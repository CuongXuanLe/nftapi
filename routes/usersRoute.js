const fs = require('fs');
const express = require('express');

const nfts = JSON.parse(
    fs.readFileSync(`${__dirname}/../nft-data/data/nft-users.json`)
);

// USERS
const getAllUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Internal server error",
    })
}

const getSingleUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Internal server error",
    })
}

const createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Internal server error",
    })
}

const updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Internal server error",
    })
}

const deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Internal server error",
    })
}

const router = express.Router();

//CRUD USERS
router.route("/")
    .get(getAllUsers)
    .post(createUser);

router.route("/:id")
    .get(getSingleUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;