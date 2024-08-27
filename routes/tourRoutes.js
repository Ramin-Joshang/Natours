const express = require('express');
const { getAllTours, createTour, getTourById, updateTour, deleteTour, checkId, checkBody, aliasTopTours, getTourStats, getMonthlyPlan } = require('../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const { createReview } = require('../controllers/reviewController');

const router = express.Router();

// router.param("id", checkId);

router.
    route("/top-5-cheap")
    .get(aliasTopTours, getAllTours)

router.
    route("/tour-stats")
    .get(getTourStats)

router.
    route("/monthly-plan/:year")
    .get(getMonthlyPlan)

router
    .route('/')
    .get(protect, getAllTours)
    .post(createTour);

router
    .route("/:id")
    .get(getTourById)
    .patch(updateTour)
    .delete(protect, restrictTo("admin", "lead-guide"), deleteTour)

// * POST /tour/234fad4/reviews
// * GET /tour/234fad4/reviews
// * GET /tour/234fad4/reviews/94887fda

router.route("/:tourId/reviews")
    .post(protect, restrictTo("user"), createReview)

module.exports = router;