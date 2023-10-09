const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./database");
const cloudinary = require("cloudinary");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Uncaught Exception: ${err}`);
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});

// Importing config file
dotenv.config({ path: "backend/config/config.env" });

// Connecting to Database
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Starting the server
app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.error(`Error : ${err}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  process.exit(1); // To exit with an error code of one for unhandled rejections
});
