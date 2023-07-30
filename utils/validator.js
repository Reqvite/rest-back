const userIdValidator = (req, res, next) => {
  if (req.userId !== req.params.id) {
    res.sendStatus(403);
  } else {
    return next();
  }
};

module.exports = { userIdValidator };
