const express = require("express");
const cors = require("cors");
const skillRouter = require("./routes/skillRouter");
const errorHandler = require("./middlewares/errorHandler");
const app = express();

app.use(cors());
app.use(express.json());

//路由
app.get("/healthcheck", (req, res) => {
  return res.send("OK");
});

app.use("/api/coaches", skillRouter);

app.use(errorHandler)
module.exports = app;
