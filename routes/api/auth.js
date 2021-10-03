const express = require('express') //Instance Of Express 
const router = express.Router() //Initializing Router Object
const auth = require('../../middleware/auth') //Importing MiddleWare
const User = require('../../models/User') //Importing User Model 



//Auth Get  Route 
router.get('/',auth,(req,res)=>{
    User.findById(req.user.id,(err,result)=>{
        res.status(200).json({msg:result})
    }).select('-password')

})



module.exports=router