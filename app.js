const express = require("express");
const morgan = require("morgan");

const AppError = require("./Utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const nftsRouter = require("./routes/nftsRoute");
const usersRouter = require("./routes/usersRoute");

const app = express();
app.use(express.json());

// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }

app.use(morgan("dev"));

//SERVING TEMPLATE DEMO
app.use(express.static(`${__dirname}/nft-data/img`));

//CUSTOM MIDDLE WARE
app.use((req, res, next) => {
  console.log("Hey i am from middleware function");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/nfts", nftsRouter);
app.use("/api/v1/users", usersRouter);

// handle no existing urls
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `can't find ${req.originalUrl} on this server`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = "fail";
  // err.statusCode = 404;
  // next(err);

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// global error handler
app.use(globalErrorHandler);

module.exports = app;
