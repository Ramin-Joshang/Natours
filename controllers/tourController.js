const fs = require('fs');
const Tour = require("./../models/tourModel");

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
        const tours = await Tour.find();
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

        const newTour = await Tour.create(req.body)

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
            new: true
        })
        res.status(200).json({
            status: "success",
            data: {
                tour: "Updated successfully"
            }
        })

    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error
        })
    }
};

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: "success",
        // data: {
        //     tour: "Deleted successfully"
        // }
    })
};