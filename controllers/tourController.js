const Tour = require('./../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const { deleteOne, updateOne, createOne, getOne, getAll } = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5',
        req.query.sort = '-ratingsAverage,price',
        req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

exports.getAllTours = getAll(Tour);

exports.getTourById = getOne(Tour, { path: "reviews" });

exports.createTour = createOne(Tour);

exports.updateTour = updateOne(Tour);

exports.deleteTour = deleteOne(Tour);



exports.getTourStats = catchAsync(async (req, res, next) => {
    // try {
    const stats = await Tour.aggregate([
        {
            $match: {
                ratingsAverage: { $gte: 4.5 },
                // secretTour: { $ne: true }
            }
        },
        {
            $group: {
                _id: { $toUpper: "$difficulty" },
                num: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            }
        },
        {
            $sort: { avgPrice: 1 }
        },
        // {
        //     $match: {
        //         _id: { $ne: "EASY" }
        //     }
        // }
    ]);
    res.status(200).json({
        status: 'success',
        results: stats.length,
        data: {
            stats
        }
    })

    // } catch (error) {
    //     res.status(404).json({
    //         status: 'fail',
    //         message: error
    //     })
    // }
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    // try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: "$name" }
            },
        },
        {
            $addFields: { month: '$_id' }
        },
        {

            $project: {
                _id: 0
            }
        },
        {

            $sort: {
                numTourStarts: -1
            }
        },
        {
            $limit: 12
        }
    ]);

    res.status(200).json({
        status: 'success',
        // results: stats.length,
        data: {
            plan
        }
    })

    // } catch (error) {
    //     console.log(error)
    //     res.status(404).json({
    //         status: 'fail',
    //         message: error
    //     })
    // }
});