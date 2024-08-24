const express = require('express');
const { getAllUsers, createUser, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { signup, login, forgotPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)

router.post("/forgotPassword", forgotPassword)
router.patch("/resetPassword/:token", resetPassword)

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