const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./database");

// Importing config file
dotenv.config({ path: "backend/config/config.env" });

// Connecting to Database
connectDatabase();

// Starting the server
app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
