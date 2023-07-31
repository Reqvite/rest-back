const asyncErrorHandler = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => {

      // in case error from DB
      if (err.model) {
        err.statusCode = 400;
      }
      
      console.log(err);
      return next(err);
    });
  };
};

module.exports = asyncErrorHandler;
