const { StatusCodes } = require('http-status-codes');
const { BAD_REQUEST, CONFLICT } = StatusCodes;
const MONGO_ENTITY_EXISTS_ERROR_CODE = 11000;

const asyncErrorHandler = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => {
      // in case error from DB
      if (err.name === 'CastError') {
        err.statusCode = BAD_REQUEST;
      }

      if (err.code === MONGO_ENTITY_EXISTS_ERROR_CODE) {
        err.statusCode = CONFLICT;
        err.message = 'Invalid credentials!';
        console.log(err);
      }

      console.log(err);
      return next(err);
    });
  };
};

module.exports = asyncErrorHandler;
