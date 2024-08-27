const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');
const hpp = require('hpp');
const AppError = require('./utils/appError')
const globalErrorHandler = require("./controllers/errorController")
const tourRouter = require("./routes/tourRoutes")
const userRouter = require("./routes/userRoutes")
const reviewRouter = require("./routes/reviewRoutes")

const app = express();

// * 1) Middlewares
app.use(helmet());
// if (process.env.NODE_ENV === "development") {
app.use(morgan("dev"));
// }

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour."
});
app.use('/api', limiter);


app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

app.use(hpp({
    whitelist: [
        "duration",
        "ratingsQuantity",
        "ratingsAverage",
        "maxGroupSize",
        "difficulty",
        "price"
    ]
}))

// Data

app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
    console.log("Hello from the middleware 👋");
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toDateString();
    // console.log(req.headers)
    next();
})

// * 3) Routes
// * First Way
// app.get("/api/v1/tours", getAllTours);
// app.post('/api/v1/tours', createTour); 
// app.get("/api/v1/tours/:id", getTourById)
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/reviews", reviewRouter)

app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: "fail",
    //     message: `Can't find ${req.originalUrl} on this server!`
    // })

    // const err = new Error(`Can't find ${req.originalUrl} on this server`);
    // err.status = "fail";
    // err.statusCode = 404;

    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
});

app.use(globalErrorHandler);

module.exports = app;