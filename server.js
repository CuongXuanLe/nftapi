const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
}).then((con) => {
  // console.log(con.connection);
  console.log("DB Connection Successfully");
});

// const testNFT = new NFT({
//   name: "hehehe sucskaldk",
//   rating: 3.2,
//   price: 567
// })

// testNFT.save().then(docNFT => {
//   console.log(docNFT)
// }).catch((error) => {
//   console.log("ERROR: ", error)
// })

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});
