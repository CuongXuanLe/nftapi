const mongoose = require("mongoose");
const slugify = require("slugify");

const nftSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A NFT must have a name"],
        unique: true,
        trim: true,
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
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, "A NFT must have price"],
    },
    priceDiscount: Number,
    summary: {
        type: String,
        required: [true, "must provide the summary"],
        trim: true
    },
    description: {
        type: String,
        trim: true
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
    }
    },
    {
        toJSON: { virtuals: true},
        toObject: { virtuals: true}
    }
)

nftSchema.virtual("durationWeeks").get(function(){
    return this.duration / 7;
})

nftSchema.pre("save", function(next) {
    console.log(this);
    this.slug = slugify(this.name, {lower: true});
    next();
})

// nftSchema.pre("save", function(next) {
//     console.log("doc will be save ...");
//     next();
// });

// nftSchema.post("save", function (doc, next) {
//     console.log(doc);
//     next();
// })

//query middleware
nftSchema.pre(/^find/, function(next) {
    this.find({secretNfts: {$ne: true}});
    this.start = Date.now();
    next();
});

// nftSchema.pre("findOne", function(next) {
//     this.find({secretNfts: {$ne: true}})
//     next();
// });

nftSchema.post(/^find/, function (doc, next) {
    console.log(`Query took time: ${Date.now() - this.start} times`);
    // console.log(doc);
    next();
})

//Aggre middleware
nftSchema.pre("aggregate", function(next) {
    this.pipeline().unshift({$match: {secretNft: {$ne: true}}})
    // console.log(this.pipeline());
    next();
})

const NFT = mongoose.model("NFT", nftSchema);

module.exports = NFT;