const { StatusCodes } = require('http-status-codes');
const { NOT_FOUND, UNAUTHORIZED, FORBIDDEN, BAD_REQUEST, CONFLICT } =
  StatusCodes;
const MONGO_ENTITY_EXISTS_ERROR_CODE = 11000;

const asyncErrorHandler = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => {

      // in case error from DB
      if (err.model) {
        err.statusCode = BAD_REQUEST;
      }

      if (err.code === MONGO_ENTITY_EXISTS_ERROR_CODE) {
        err.statusCode = CONFLICT;
      }

      console.log(err);
      return next(err);
    });
  };
};

module.exports = asyncErrorHandler;
