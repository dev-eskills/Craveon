class ErrorResponse extends Error {
  constructor(message, statusCode = 500, data = null) {
    super(message);
    this.statusCode = statusCode;
    this.data = data; // Optional additional data
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;
