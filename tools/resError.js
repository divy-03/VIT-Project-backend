const resError = (statusCode, error, res) => {
  res.status(statusCode).json({
    success: false,
    error: error,
  });
};

module.exports = resError;
