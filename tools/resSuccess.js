const resSuccess = (statusCode, message, res) => {
  res.status(statusCode).json({
    success: true,
    message: message,
  });
};

module.exports = resSuccess;
