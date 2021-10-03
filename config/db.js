const mongoose = require('mongoose'); //Instance of Mongoose
const config = require('config'); //Instance of config
const db= config.get('mongoURI') //getting mongoURI form default.json

//Connecting MongoDB
 
const connectDB = async ()=>{
    try {
       await mongoose.connect(db,{
           useNewUrlParser: true ,
           useUnifiedTopology:true,
           useCreateIndex:true,
           useFindAndModify: false
       })
       console.log("Database Succesfully Connected !!")
    } 
    catch (err) {
        console.log("Error Connecting Database ",err.message)
    }
}

module.exports = connectDB