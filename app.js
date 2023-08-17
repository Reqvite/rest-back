const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./utils/swagger');
const connectDB = require('./db');
const cors = require('cors');
require('dotenv').config();
const globalErrorHandler = require('./utils/errors/globalErrorHandler');
const { NotFoundError } = require('./utils/errors/CustomErrors');

//routes
const routes = require('./routes');

let app = express();

// connect to the database
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
app.use(cors({ origin: process.env.CORS_ORIGIN }));

//routes
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpecs));
app.use('/healthcheck', routes.healthcheck);

app.use('/sse', routes.sse);
app.use(`/restaurants`, routes.restaurants);
app.use(`/personnel`, routes.personnel);
app.use(`/transactions`, routes.transactions);
app.use('/orders', routes.orders);
app.use('/ingredients', routes.ingredients);
app.use('/tables', routes.tables);
app.use(`/dishes`, routes.dishes);
app.use(`/login`, routes.login);
app.use(`/tokens`, routes.tokens);
app.use('/api', routes.upload);
app.use('/openai', routes.openai);

app.all('*', (req, _, next) => {
  const err = new NotFoundError(`Cant find ${req.originalUrl} on the server`);
  next(err);
});

app.use(globalErrorHandler);

app.listen(3001, () => console.log('Example app listening on port 3001!'));

module.exports = app;
