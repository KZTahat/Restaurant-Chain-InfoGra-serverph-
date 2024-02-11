"use strict";

const express = require("express");
const app = express();
const notFoundHandler = require("./errorHandlers/404.js");
const internalServerError = require("./errorHandlers/500");

// importing all routes
const restaurantsRoutes = require('./routes/restaurantRoutes.js')

app.use(express.json());

// Proof Of Life
app.get("/", (req, res) => {
  res.status(200).send("All Good :)");
});

// using routes
app.use(restaurantsRoutes);

app.use("*", notFoundHandler);
app.use(internalServerError);

function start(port) {
  app.listen(port, () => console.log(`server listening On port ${port}`));
}

module.exports = {
  start,
  app,
};