require("dotenv").config();
const fs = require("fs");
const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
colors.enable();
require("./database");

//Libs
const AppError = require("./libs/AppError");

//Controller
const ErrorController = require("./controllers/ErrorController");

const router = require("./routers");

//DB Connection

//Init server
const server = express();

server.use(cors());

// Development logging
if (process.env.NODE_ENV === "development") {
  server.use(morgan("dev"));
}
server.use(express.json());

server.use(router);

server.all("*", (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

server.use(ErrorController);

const port = process.env.PORT || 8383;

server.listen(port, () => {
  console.log(`Server running on ${port}`.blue);
});
