const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

process.on("uncaughtException", (err) => {
  console.error("uncaughtException REJECTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
})

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
}).then((con) => {
  console.log("DB Connection Successfully");
})


console.log('hehe', process.env.NODE_ENV)

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
})