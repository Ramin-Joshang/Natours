const fs = require('fs');
const Tour = require("./../models/tourModel");
const { json } = require('express');

// exports.checkId = (req, res, next, value) => {
//     console.log(`Tour id is : ${value}.`)
//     const { id } = req.params;
//     // const tour = tours.find(tour => tour.id == id);

//     if (!tour) {
//         return res.status(404).json({
//             status: 'fail',
//             message: "Invalid ID"
//         })
//     }
//     next();
// }

// exports.checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.price) {
//         return res.status(400).json({
//             status: "fail",
//             message: "Missing name or price"
//         });
//     }
//     next();
// }

exports.getAllTours = async (req, res) => {
    try {
        console.log(req.query);
        // * Build Query
        // * 1A) Filtering
        const queryOjb = { ...req.query };
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach(el => delete queryOjb[el]);

        // * 1B) Advanced Filtering
        let queryStr = JSON.stringify(queryOjb);
        queryStr = queryStr.replace(/\b(gte|gt|let|lt)\b/g, match => `$${match}`);
        console.log(JSON.parse(queryStr));

        let query = Tour.find(JSON.parse(queryStr));

        // * 2) Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            console.log(sortBy)
            query = query.sort(sortBy)
        } else {
            query = query.sort("-createdAt");
        }

        // * 3) Field Limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        }

        // * Execute Query
        const tours = await query;

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error
        })
    }

};

exports.getTourById = async (req, res) => {
    const { id } = req.params
    try {
        // * Tour.findOne({_id: id})
        const tour = await Tour.findById(id);
        res.status(200).json({
            status: 'success',
            results: 1,
            data: {
                tour
            }
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error
        })
    }
};

exports.createTour = async (req, res) => {
    try {
        // const newTours=new Tour({});
        // newTours.save();

        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        })
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            message: error
        })
    }
}

exports.updateTour = async (req, res) => {
    const { id } = req.params;
    try {
        const tour = await Tour.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        })

    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error
        })
    }
};

exports.deleteTour = async (req, res) => {
    const { id } = req.params;
    try {
        const tour = await Tour.findByIdAndDelete(id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        })

    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error
        })
    }
};