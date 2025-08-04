const express = require("express");

const errorHandler = (req, res, next) => {
  const error =
    req.error.statusCode > 500
      ? (req.error.message = "Server error")
      : req.error.message;
  res.status(req.error.statusCode).json({
    success: false,
    message: error,
  });
};

module.exports = errorHandler;
