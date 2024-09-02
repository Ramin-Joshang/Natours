const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { deleteOne, updateOne, getOne, getAll } = require("./handlerFactory");


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
}

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
    const { password, passwordConfirm } = req.body;
    const { id } = req.user;
    console.log("hi")
    // * 1) Create error if user Post password data
    if (password || passwordConfirm) {
        return next(new AppError("This route is not for password updates. Please use /updateMyPassword", 400))
    }
    // * 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, "name", "email");
    // * 3) Update user data
    const updatedUser = await User.findByIdAndUpdate(id, filteredBody, { new: true, runValidators: true });
    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser
        }
    });
});


exports.deleteMe = catchAsync(async (req, res, next) => {
    const { id } = req.user;
    await User.findByIdAndUpdate(id, { active: false });

    res.status(204).json({
        status: "success",
        data: null
    })
});

exports.createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined!"
    })
}
exports.getAllUsers = getAll(User);
exports.getUserById = getOne(User);
// * Do NOT update password with this!
exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);