const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./utils/swagger');
const connectDB = require('./db');

//routes imports for the different parts of the application
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const healthcheckRoute = require('./routes/healthcheck');
const restaurantsRoute = require('./routes/restaurants');
const administratorsRoute = require('./routes/administrators');
const waitersRoute = require('./routes/waiters');
const transactionsRoute = require('./routes/transactions');
const tablessRoute = require('./routes/tables');

let app = express();

//connect to the database
try {
  connectDB();
} catch (err) {
  console.log(err);
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/', indexRouter);

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpecs));
app.use('/healthcheck', healthcheckRoute);

app.use('/users', usersRouter);
app.use('/restaurants', restaurantsRoute);
app.use('/administrators', administratorsRoute);
app.use('/waiters', waitersRoute);
app.use('/transactions', transactionsRoute);
app.use('/tables', tablessRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));

module.exports = app;
