const express = require("express");
const authRoutes = require('./Endpoints/AuthRoutes')
const cors =require('cors');
const SecureRoutes = require('./Endpoints/SecureRoutes');
const AuthMiddleware = require('./Middleware/AuthMiddleware');
const app=express();
const connectDB = require('./config/db'); 
require('dotenv').config();
connectDB();
app.use(express.json())
// app.use(cors());
app.use(cors({
    origin: 'http://localhost:5173'  // Allow only requests from this URL
}));


app.get("/",(req,res)=>{
    res.send("helloworld")
})
app.use('/auth', authRoutes);

app.use('/secureRoute',AuthMiddleware,SecureRoutes)

app.listen(3000,()=>{
    console.log("server is running on port",3000)
})