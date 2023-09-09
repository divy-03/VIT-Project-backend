const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose.connect(process.env.MONGODB_URI).then((data) => {
    console.log(`MongoDB connected with server : ${data.connection.host}`);
  });
};

module.exports = connectDatabase;
