const mongoose = require('mongoose') //Instance of mongoose
var Schema = mongoose.Schema;

const UserSchema = Schema({

    "name":{
        type:String,
        require:true,
        trim:true
    },
    "email":{
        type:String,
        require:true,
        trim:true,
        unique:true
    },
    "age":{
        type:Number,
        require:true
    },
    "password":{
        type:String,
        require:true,
    },
    "email_subscription_status":{
        type:String,
        default:true
    },
    "subscripiton_plan":{
        type:String,
        default:"Free"
    },
    "date":{
        type:Date,
        default:Date.now()
    }
})
module.exports= User = mongoose.model("user",UserSchema)
