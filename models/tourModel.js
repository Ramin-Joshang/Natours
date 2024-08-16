const { mongoose } = require("mongoose");

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true,
        trim: true
    },
    durations: {
        type: Number,
        required: [true, "A tour must have duration"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have group size"],
    },
    difficulty: {
        type: String,
        required: [true, "A tour must have difficulty"],
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"]
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        required: [true, "A tour must have a description"]
    },
    imageCover: {
        type: String,
        required: [true, "A tour must have a cover image"]
    },
    image: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date],
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;