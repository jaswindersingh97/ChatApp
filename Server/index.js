const express = require("express");
const authRoutes = require('./Endpoints/AuthRoutes')
const app=express();
const connectDB = require('./config/db'); 
require('dotenv').config();
connectDB();
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("helloworld")
})
app.use('/auth', authRoutes);

app.listen(3000,()=>{
    console.log("server is running on port",3000)
})