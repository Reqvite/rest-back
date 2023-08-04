const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const { NOT_FOUND, UNAUTHORIZED, FORBIDDEN, BAD_REQUEST } = StatusCodes;

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
    super(message || getReasonPhrase(BAD_REQUEST), BAD_REQUEST);
  }
}

class NotFoundError extends CustomError {
  constructor(message) {
    super(message || getReasonPhrase(NOT_FOUND), NOT_FOUND);
  }
}

class AuthorizationError extends CustomError {
  constructor(message) {
    super(message || getReasonPhrase(UNAUTHORIZED), UNAUTHORIZED);
  }
}

class AuthenticationError extends CustomError {
  constructor(message) {
    super(message || getReasonPhrase(FORBIDDEN), FORBIDDEN);
  }
}

module.exports = {
  NotFoundError,
  BadRequestError,
  AuthorizationError,
  AuthenticationError,
};
