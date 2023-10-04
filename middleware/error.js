// const ErrorHandler = require("../utils/errorHandler");
const resError = require("../tools/resError");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  if (err.name === "CastError") {
    const message = `Resource not found. Invalid : ${err.path}`;
    resError(400, message, res);
  }
  if (err.code === 11000) {
    resError(403, "User already exists", res);
  }

  return resError(err.statusCode, err.message, res);
};
