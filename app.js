const express = require('express')
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
app.use(cookieParser());
app.use(bodyParser.json());
const dotenv = require('dotenv')
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.json());
dotenv.config({path:"./config.env"})
app.use(require('./router/auth'));


const DB = process.env.DB
const PORT = process.env.PORT
const User = require('./model/userSchema');

require("./db/conn");


app.get('/',(req,res)=>{
    console.log("Server")
    res.send("Server started")
})


app.listen(PORT,()=>{
    console.log("Server is running on port",PORT)
})