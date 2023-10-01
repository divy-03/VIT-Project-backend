const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const errorMiddleware = require("./middleware/error");

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Route Imports
const product = require("./routes/productRoutes");

// Using API Routes
app.use("/api/", product);

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
