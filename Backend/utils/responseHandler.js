// utils/responseHandler.js

/**
 * Creates a standardized API response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Response message
 * @param {object|array|null} data - Response data
 * @param {object} meta - Additional metadata
 * @returns {object} Express response
 */
exports.createResponse = (res, statusCode, message, data = null, meta = {}) => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data,
    meta,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Handles API errors
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Error} error - Original error object
 * @returns {object} Express response
 */
exports.handleError = (res, statusCode, message, error = null) => {
  console.error(error);
  const errorResponse = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };

  // Include error details in development environment
  if (process.env.NODE_ENV === "development" && error) {
    errorResponse.error = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return res.status(statusCode).json(errorResponse);
};

/**
 * Middleware for handling async route handlers
 * @param {function} fn - Async route handler function
 * @returns {function} Express middleware
 */
exports.asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Format validation errors from express-validator
 * @param {array} errors - Validation errors
 * @returns {object} Formatted errors object
 */
exports.formatValidationErrors = (errors) => {
  return errors.reduce((acc, error) => {
    acc[error.param] = error.msg;
    return acc;
  }, {});
};
