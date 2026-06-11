// src/middleware/error.js
const ErrorResponse = require("../utils/errorResponse");
const logger = require("../config/logger");
const logsController = require("../controllers/logs.controller");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error details to DB
  logsController.saveLog({
    level: "error",
    message: err.message,
    meta: {
      method: req.method,
      endpoint: req.originalUrl,
      requestBody: req.body,
      query: req.query,
      params: req.params,
      user: req.user || null,
      statusCode: err.statusCode || 500,
      stack: err.stack,
    },
  });

  // Log error to console via logger
  logger.error(err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
