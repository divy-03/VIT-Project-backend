const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./database");

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
