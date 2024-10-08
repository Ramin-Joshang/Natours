const express = require("express");
const { getAllReviews, createReview, deleteReview, updateReview, setTourUserIds, getReview } = require("../controllers/reviewController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(protect);

router
    .route("/")
    .get(getAllReviews)
    .post(restrictTo("user"), setTourUserIds, createReview)

router
    .route('/:id')
    .get(getReview)
    .patch(protect, restrictTo("admin", "user"), updateReview)
    .delete(protect, restrictTo("admin", "user"), deleteReview)

module.exports = router