const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const nftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A NFT must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "Must be at least 40 characters"],
      minlength: [10, "Must be at least 10 characters"],
      //   validator: [validator.isAlpha, "NFT name must only contain Characters"],
    },
    slug: String,
    duration: {
      type: String,
      required: [true, "must have durations"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "must have difficulty"],
      enum: {
        values: ["easy", "medium", "difficulty"],
        message: "Difficulty is either: easy, medium and difficulty",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "must have 1"],
      max: [5, "must have 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A NFT must have price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    summary: {
      type: String,
      required: [true, "must provide the summary"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "must provide the cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretNfts: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

nftSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

nftSchema.pre("save", function (next) {
  console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

//query middleware
nftSchema.pre(/^find/, function (next) {
  this.find({ secretNfts: { $ne: true } });
  this.start = Date.now();
  next();
});

nftSchema.post(/^find/, function (doc, next) {
  console.log(`Query took time: ${Date.now() - this.start} times`);
  // console.log(doc);
  next();
});

//Aggre middleware
nftSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretNft: { $ne: true } } });
  next();
});

const NFT = mongoose.model("NFT", nftSchema);

module.exports = NFT;
