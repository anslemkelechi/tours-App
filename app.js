const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();

// GLOBAL MIDDLE-WARES

//Set security HTTP headers
app.use(helmet());

//Set Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  standardHeaders: true,
  message: 'Too Many Request From this IP, please try again in an hour',
});

//Set API Limit
app.use('/api', limiter);

//Body parser, reading data form body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
);

//Data Sanitization against NOSQL query Injection
app.use(mongoSanitize());

//Data Sanitization against XSS
app.use(xss());

//prevent paramter population

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingQuantity',
      'ratingAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//Serving static files
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this resource`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
