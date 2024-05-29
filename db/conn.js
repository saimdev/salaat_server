const mongoose = require('mongoose')

const dotenv = require("dotenv")
const DB = process.env.DB



mongoose.connect(DB).then(()=>{
    console.log("DB connected")
}).catch((err)=>{
    console.log(err)
})