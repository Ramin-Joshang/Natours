const express = require('express');
const { getAllUsers, createUser, getUserById, updateUser, deleteUser, updateMe, deleteMe, getMe } = require('../controllers/userController');
const { signup, login, forgotPassword, resetPassword, protect, updatePassword } = require('../controllers/authController');
const { createReview } = require('../controllers/reviewController');

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)

router.post("/forgotPassword", forgotPassword)
router.patch("/resetPassword/:token", resetPassword);

router.patch("/updateMyPassword", protect, updatePassword);

router.get("/me", protect, getMe, getUserById);
router.patch("/updateMe", protect, updateMe);
router.delete("/deleteMe", protect, deleteMe);


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