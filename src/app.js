const express = require("express");
const path = require("path");

const app = express();

// Middleware
app.use(express.static(path.resolve("./public")));
app.use(express.json());

module.exports = app;
