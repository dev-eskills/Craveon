exports.handleError = (res, statusCode, message, error) => {
  console.error(error); // Log the error for debugging
  return res.status(statusCode).json({
    success: false,
    message,
    error: error?.message || "An unknown error occurred",
  });
};
