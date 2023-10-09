const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const errorMiddleware = require("./middleware/error");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.get("/set-cookie", (req, res) => {
  res.cookie("myCookie", "cookieValue", { maxAge: 900000, httpOnly: true });
  res.send("Cookie set successfully!");
});

// Route Imports
const product = require("./routes/productRoutes");
const user = require("./routes/userRoutes");

// Using API Routes
app.use("/api/", product);
app.use("/api/", user);

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
