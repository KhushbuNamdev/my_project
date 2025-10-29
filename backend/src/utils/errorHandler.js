/**
 * Base Error class for custom errors
 */
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request Error
 */
class BadRequestError extends CustomError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

/**
 * 401 Unauthorized Error
 */
class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

/**
 * 403 Forbidden Error
 */
class ForbiddenError extends CustomError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

/**
 * 404 Not Found Error
 */
class NotFoundError extends CustomError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * 409 Conflict Error
 */
class ConflictError extends CustomError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

/**
 * 500 Internal Server Error
 */
class InternalServerError extends CustomError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Default error status and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${new Date().toISOString()}] ${err.stack || err}`);
  }

  // Send error response
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    // Include stack trace in development only
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export {
  CustomError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  errorHandler,
};
