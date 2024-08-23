const express = require('express');
const { getAllTours, createTour, getTourById, updateTour, deleteTour, checkId, checkBody, aliasTopTours, getTourStats, getMonthlyPlan } = require('../controllers/tourController');
const { protect } = require('../controllers/authController');

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
    .delete(deleteTour)

module.exports = router;