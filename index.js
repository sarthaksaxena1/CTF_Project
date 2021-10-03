const express = require('express') //intialize express
const app= express(); //express instance
const connectDB = require('./config/db')
//Using Body Parser
app.use(express.json({extended:true}))
//Connecting Database
connectDB();

app.get('/',(req,res)=>{
    console.log("Request Hit At / ")
    res.send("Home Page")
})

//Using Routes
app.use('/api/users',require('./routes/api/users')) //Using User Route

app.use('/api/auth',require('./routes/api/auth')) //Using Auth Route 

app.use('/api/profile',require('./routes/api/profile')) //Using Auth Route 


app.listen(4444,()=>{
    console.log("Server Succesfully Started On 4444")
})