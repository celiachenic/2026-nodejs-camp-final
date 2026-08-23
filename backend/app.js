const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

//路由

module.exports = app
