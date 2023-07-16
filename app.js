const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./utils/swagger');

//routes imports for the different parts of the application
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let healthcheckRoute = require('./routes/healthcheck');
let restaurantsRoute = require('./routes/restaurants');
let administratorsRoute = require('./routes/administrators');
let waitersRoute = require('./routes/waiters');


let app = express();


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
app.use(`restaurants`, restaurantsRoute);
app.use(`administrators`, administratorsRoute);
app.use(`waiters`, waitersRoute);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));

module.exports = app;
