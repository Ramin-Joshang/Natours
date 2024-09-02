const express = require('express');
const { getAllTours, createTour, getTourById, updateTour, deleteTour, checkId, checkBody, aliasTopTours, getTourStats, getMonthlyPlan } = require('../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
// const { createReview } = require('../controllers/reviewController');
const reviewRouter = require("./reviewRoutes")

const router = express.Router();

// router.param("id", checkId);

// * POST /tour/234fad4/reviews
// * GET /tour/234fad4/reviews
// * GET /tour/234fad4/reviews/94887fda

// router.route("/:tourId/reviews")
//     .post(protect, restrictTo("user"), createReview)

router
    .use("/:tourId/reviews", reviewRouter)

router.
    route("/top-5-cheap")
    .get(aliasTopTours, getAllTours)

router.
    route("/tour-stats")
    .get(getTourStats)

router.
    route("/monthly-plan/:year")
    .get(protect, restrictTo("admin", "lead-guide", "guide"), getMonthlyPlan)

router
    .route('/')
    .get(getAllTours)
    .post(protect, restrictTo("admin", "lead-guide"), createTour);

router
    .route("/:id")
    .get(getTourById)
    .patch(protect, restrictTo("admin", "lead-guide"), updateTour)
    .delete(protect, restrictTo("admin", "lead-guide"), deleteTour)



module.exports = router;