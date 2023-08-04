const mongoose = require('mongoose');
const { BadRequestError, AuthenticationError } = require('../utils/errors/CustomErrors');
const { StatusCodes } = require('http-status-codes');
const { BAD_REQUEST, FORBIDDEN } = StatusCodes;

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateObjectId = (req, _, next) => {
  const invalidValues = Object.keys(req.params)
    .filter(param => !isValidObjectId(req.params[param]))
    .map(param => req.params[param]);

  if (invalidValues.length > 0) {
    const errMessage = `Invalid ObjectId(s) in request params: ${invalidValues.join(', ')}`;
    const err = new BadRequestError(errMessage);
    return next(err);
  }

  next();
};

const validateIdInJoiSchema = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

const userIdValidator = (req, res, next) => {
  if (req.userId !== req.params.id) {
    const err = AuthenticationError();
    return next(err)
  } else {
    return next();
  }
};

const validateBody = (schema) => async (req, _, next) => {
  const body = req.body;
  try {
    await schema.validateAsync(body);
    return next();
  } catch (error) {
    error.statusCode = BAD_REQUEST;
    console.log(error);
    next(error);
  }
};

module.exports = {
  validateObjectId,
  validateIdInJoiSchema,
  userIdValidator,
  validateBody,
};
