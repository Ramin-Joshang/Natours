const fs = require('fs');
const Tour = require('./../models/tourModel');
const { json } = require('express');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5',
        req.query.sort = '-ratingsAverage,price',
        req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

exports.getAllTours = async (req, res) => {
    try {
        // * Execute Query
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const tours = await features.query;

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        })
    }

};

exports.getTourById = catchAsync(async (req, res, next) => {
    const { id } = req.params
    // try {
    // * Tour.findOne({_id: id})
    const tour = await Tour.findById(id);

    if (!tour) {
        return next(new AppError("No tour found with id " + id, 404));
    }

    res.status(200).json({
        status: 'success',
        results: 1,
        data: {
            tour
        }
    })
    // } catch (error) {
    //     res.status(404).json({
    //         status: 'fail',
    //         message: error
    //     })
    // }
});



exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    })


    // try {
    // const newTours=new Tour({});
    // newTours.save();

    // }
    // catch (error) {
    //     res.status(400).json({
    //         status: 'fail',
    //         message: error
    //     })
    // }
})

exports.updateTour = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    // try {
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })

    // } catch (error) {
    //     res.status(404).json({
    //         status: 'fail',
    //         message: error
    //     })
    // }
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    // try {
    const tour = await Tour.findByIdAndDelete(id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })

    // } catch (error) {
    //     res.status(404).json({
    //         status: 'fail',
    //         message: error
    //     })
    // }
});

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