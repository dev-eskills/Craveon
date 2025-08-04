exports.createResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: statusCode < 400, // true for 2xx, false for 4xx/5xx
    message,
    data,
  });
};
