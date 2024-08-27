const { mongoose } = require("mongoose");
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: [true, "A tour name must be unique"],
        trim: true,
        maxlength: [40, 'A tour name must have less or equal than 40 characters'],
        minlength: [10, 'A tour name must have less or equal than 10 characters'],
        // validate: [validator.isAlpha, 'Tour name must only contain alpha characters']
    },
    slug: String,
    duration: {
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
        enum: {
            values: ["easy", "medium", "difficult"],
            message: "Difficulty is either: easy or medium and difficulty"
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        max: [5, "Raining must be below 5.0"],
        min: [1, "Rating must be above 1.0"]
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"]
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (value) {
                // * this only points to current doc on New document creation
                return value < this.price; // ? 100 < 200
            },
            message: "Discount price ({VALUE}) should be below regular price"
        }
    },
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
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        // * GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: "Point",
                enum: ["Point"]
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ]
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

tourSchema.virtual("durationWeeks").get(function () {
    return this.duration / 7
});

// * Document Middleware: runs before .save() and .create()
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// tourSchema.pre('save', function (next) {
//     console.log("Will save document ...");
//     next();
// });

// tourSchema.post("save", function (doc, next) {
//     console.log(doc);
//     next();
// });

// * Query Middleware
// * /^find/ => short hand of find and findOne query middleware
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });

    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds`)
    // console.log(docs);
    next();
});

// * Aggregation Middleware
tourSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({
        $match: {
            secretTour: { $ne: true }
        }
    })
    console.log(this.pipeline())
    next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;