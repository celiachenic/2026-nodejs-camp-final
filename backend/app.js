const express = require("express");
const cors = require("cors");
const skillRouter = require('./routes/skillRouter')
const packageRouter = require('./routes/packageRouter')
const app = express();

app.use(cors());
app.use(express.json());

//路由
app.get('/healthcheck',(req,res)=>{
    return res.send('OK')
})

app.use('/api/coaches',skillRouter)

module.exports = app
