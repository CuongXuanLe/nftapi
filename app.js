const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./Utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const nftsRouter = require("./routes/nftsRoute");
const usersRouter = require("./routes/usersRoute");

const app = express();
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      "duration",
      "difficulty",
      "maxGroupSize",
      "price",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);
app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour",
});

app.use("/api", limiter);

app.use(morgan("dev"));

//SERVING TEMPLATE DEMO
app.use(express.static(`${__dirname}/nft-data/img`));

//CUSTOM MIDDLE WARE
// app.use((req, res, next) => {
//   console.log("Hey i am from middleware function");
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/nfts", nftsRouter);
app.use("/api/v1/users", usersRouter);

// handle no existing urls
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// global error handler
app.use(globalErrorHandler);

module.exports = app;
