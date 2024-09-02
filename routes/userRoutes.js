const express = require('express');
const { getAllUsers, createUser, getUserById, updateUser, deleteUser, updateMe, deleteMe, getMe } = require('../controllers/userController');
const { signup, login, forgotPassword, resetPassword, protect, updatePassword, restrictTo } = require('../controllers/authController');
const { createReview } = require('../controllers/reviewController');

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/forgotPassword", forgotPassword)
router.patch("/resetPassword/:token", resetPassword);

// * Protect all routes after this middleware
router.use(protect);

router.patch("/updateMyPassword", updatePassword);
router.get("/me", getMe, getUserById);
router.patch("/updateMe", updateMe);
router.delete("/deleteMe", deleteMe);

router.use(restrictTo("admin"))

router
    .route("/")
    .get(getAllUsers)
    .post(createUser)

router
    .route("/:id")
    .get(getUserById)
    .patch(updateUser)
    .delete(deleteUser)

module.exports = router