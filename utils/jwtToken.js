const jwt = require("jsonwebtoken");

// Create Token and saving in cookie

const sendToken = (user, statusCode, res) => {
  const data = {
    user: {
      id: user.id,
    },
  };
  
  const authToken = jwt.sign(data, process.env.JWT_SECRET);

  // Options for cookie
  const options = {
    expries: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 1000),
    httpOnly: true,
  };

  return res.status(statusCode).cookie("authToken", authToken, options).json({
    success: true,
    authToken,
    user,
  });
};

module.exports = sendToken;
