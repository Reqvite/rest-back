const handleError =  (error, req, res, next) => {
  console.log('error 123')
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message
  })
}

module.exports = handleError;