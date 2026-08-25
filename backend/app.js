const express = require("express");
const cors = require("cors");
const skillRouter = require("./routes/skillRouter");
const packageRouter = require('./routes/packageRouter')
const errorHandler = require("./middlewares/errorHandler");
const app = express();

app.use(cors());
app.use(express.json());

//路由
app.get("/healthcheck", (req, res) => {
  return res.send("OK");
});

app.use("/api/coaches", skillRouter);
app.use("/api/credit-package", packageRouter);
app.use(errorHandler)
module.exports = app;
