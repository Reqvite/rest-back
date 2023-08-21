const { BadRequestError } = require('../utils/errors/CustomErrors');
const { StatusCodes } = require('http-status-codes');
const { BAD_REQUEST } = StatusCodes;

const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const validateObjectId = (req, _, next) => {
  const invalidValues = Object.keys(req.params)
    .filter((param) => !isValidObjectId(req.params[param]))
    .map((param) => req.params[param]);

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

const validateBody = (schema) => async (req, _, next) => {
  const body = req.body;
  try {
    await schema.validateAsync(body);
    return next();
  } catch (error) {
    error.statusCode = BAD_REQUEST;

    next(error);
  }
};

const validateQuery = (schema) => async (req, _, next) => {
  const request = req.query;
  try {
    await schema.validateAsync(request);
    return next();
  } catch (error) {
    error.statusCode = BAD_REQUEST;

    next(error);
  }
};

module.exports = {
  validateObjectId,
  validateIdInJoiSchema,
  validateBody,
  validateQuery,
};
