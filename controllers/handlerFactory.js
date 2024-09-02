const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");


exports.getAll = Modal => catchAsync(async (req, res) => {

    // * To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Modal.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const doc = await features.query;

    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            data: doc
        }
    })
});

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    const { id } = req.params;
    console.log(id)
    // * Tour.findOne({_id: id})
    let query = Model.findById(id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
        return next(new AppError(`No document found with id ${id}`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            data: doc
        }
    })
})

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);

    if (!doc) {
        return next(new AppError(`No document found with id ${id}`, 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });

    if (!doc) {
        return next(new AppError(`No document found with id ${id}`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
});
