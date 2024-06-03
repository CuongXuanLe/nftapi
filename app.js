const fs = require('fs');
const express = require('express');
const app = express();
app.use(express.json())
const nfts = JSON.parse(
    fs.readFileSync(`${__dirname}/nft-data/data/nft-simple.json`)
);

//GET REQUEST
app.get('/api/v1/nfts', (req, res) => {
    res.status(200).json({
        status: "success",
        results: nfts.length,
        data: {
            nfts: nfts,
        }
    })
})

//POST REQUEST
app.post('/api/v1/nfts', (req, res) => {
    const newId = nfts[nfts.length - 1].id + 1;
    const newNFTs = Object.assign({id: newId}, req.body);

    nfts.push(newNFTs);
    fs.writeFile(`${__dirname}/nft-data/data/nft-simple.json`,
    JSON.stringify(nfts),
    (err) => {
        res.status(201).json({
            status: "success",
            nft: newNFTs,
        })
    })
})

//GET SINGLE NFT
app.get("/api/v1/nfts/:id", (req, res)=> {

    // console.log(req.params);
    const id = req.params.id * 1;
    const nft = nfts.find((el) => (el.id === id))
    
    if (!nft){
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        })
    }

    res.status(200).json({
        status: "success",
        data: {
            item: nft,
        }
    })
})

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}....`);
})