const jwt = require('jsonwebtoken');

const handleError = (error, _, res, next) => {
  if (error instanceof jwt.TokenExpiredError) {
    error.statusCode = 401;
    error.message = 'Token expired.';
  } else {
    error.statusCode = error.statusCode || 500;
  }
  error.status = error.status || 'error';
  console.log(error.statusCode, error.message);
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message.replace(/"/g, ''),
  });
};

module.exports = handleError;
