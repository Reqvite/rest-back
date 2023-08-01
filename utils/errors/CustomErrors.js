const { StatusCodes, getStatusText } = require('http-status-codes');
const { NOT_FOUND, UNAUTHORIZED, FORBIDDEN, BAD_REQUEST } =
  StatusCodes;

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends CustomError {
  constructor(message) {
    super(message || getStatusText(BAD_REQUEST), BAD_REQUEST);
  }
}

class NotFoundError extends CustomError {
  constructor(message) {
    super(message || getStatusText(NOT_FOUND), NOT_FOUND);
  }
}

class AuthorizationError extends CustomError {
  constructor(message) {
    super(message || getStatusText(UNAUTHORIZED), UNAUTHORIZED);
  }
}

class AuthenticationError extends CustomError {
  constructor(message) {
    super(message || getStatusText(FORBIDDEN), FORBIDDEN);
  }
}

module.exports = {
  NotFoundError,
  BadRequestError,
  AuthorizationError,
  // AUTHENTICATION_ERROR: AuthenticationError,
  // ENTITY_EXISTS_ERROR: EntityExistsError
};
