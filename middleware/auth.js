const express = require('express')  //Instance Of Express
const config = require('config') // Importing Config
const jwt = require('jsonwebtoken') // Importing JWT  


module.exports=function(req,res,next)
{
//Checking If Token Is There In Header
const token = req.header('x-auth-token');
//Check If Not Token Send UnAuthorized Access
if(!token)
{
    return res.status(401).json({msg:"UnAuthorized Accesss"});
}

//Verify Token If It's There 
try{
const decoded = jwt.verify(token,config.get('jwtSecret')) //try decoding the token 
req.user=decoded.user //assiging decoded value to req.user 
next() //passing middleware to next request 
}
catch(err)
{
    if(err)
    {
        res.status(401).json({msg:"Token Not Valid"})
    }
}
}