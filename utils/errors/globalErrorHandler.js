const handleError =  (error, _, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';
  console.log(error.message)
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message.replace(/"/g, '')
  })
}

module.exports = handleError;