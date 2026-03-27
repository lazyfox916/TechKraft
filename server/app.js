const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const usersRouter = require("./src/routes/users.route");
const favouriteRouter = require("./src/routes/favourite.route");
const propertyRouter = require("./src/routes/properties.route");
const { testPostgresConnection } = require("./config/db/connectDB");

require("./src/models");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: "*" }));

testPostgresConnection();

app.use("/users", usersRouter);
app.use("/favourites", favouriteRouter);
app.use("/properties", propertyRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "TechKraft API is running",
  });
});

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = app;
