const express = require('express'); //Instance of express
const router = express.Router(); //Instance For Routing
var User = require('../../models/User'); //Importing User Model 
var bcrypt = require('bcryptjs'); //Instance Of Bcrypt for Hashing
const { check, validationResult } = require('express-validator'); //Importing For Backend Validation Check 
var jwt = require('jsonwebtoken'); //Importing JWT Tokens For Auth Proccess 
const config = require('config') // Using Config 
//POST  ROUTE UNDER DEVELOPMENT
router.post('/signup',[
    // condition for valid email
    check('email').isEmail(),
    // condition for password 
    check('password').isLength({ min: 6,max:500}),
    //conditon for age
    check('age').isNumeric()
  ],async (req,res)=>{

    const validatonErrSignup = validationResult(req); //Checking conditions
    if(!validatonErrSignup.isEmpty()){
        return res.status(422).json({"error":validatonErrSignup.array()})
    }
    try{
    let postData =  new User(req.body) //Intializing postData
    //Making Password Hash
     var salt =  await bcrypt.genSalt(10) //Creating Salt
     var finalPass = await bcrypt.hash(req.body.password,salt) //Creating Hash Using Salt 
    postData.password=finalPass  // Changing Pass Value 

    await postData.save((err)=>{ //Saving Final Values In DB
         if(err)
         {
             console.log(err)
             res.status(422).json({msg:"Signup UnSuccessfull"})
         }
         else
         {
            console.log("Succesfully Saved data in db !!")
            //IF Signup Is Success Log The User In By Returning JWT Token 
            payload ={
              user:{
                  id:postData.id,
                  name:postData.name,
              }  
            };
            jwt.sign(payload,config.get('jwtSecret'),{
                expiresIn:3600
            },(err,token)=>{
                if(err)
                {
                    res.status(422).json({"error":"Something Gone Wrong !!"})
                }
                else{
                    res.json({'token':token})
                }
            })
            //res.send("Signup Successfull")
         }
     }) 
}
    catch(err){
        console.log(err)
    }
})
//Temp Route
router.post('/login',[
    //checking for email
    check('email').isEmail()
],async (req,res)=>{
    const validatonErrLogin = validationResult(req); 
    if(!validatonErrLogin.isEmpty())
    {
        return res.status(422).json({"error":validatonErrLogin.array()})
    }
    await User.find({"email":req.body.email},(err,result)=>{
        if(err)//If There Is Any Error Fetching From DataBase Show Error
        {
            console.log("Error When Fetching DB",err)
        } 
        else //Else Go Ahead 
        {
            if(result.length===0) //If mongoDB Returns EmptyObject 
            {
                res.send("No User Exists With That Email")
            }
            //If mongoDB Returns Data Then COmpare Password In DataBase
            else{
                bcrypt.compare(req.body.password,result[0].password,(err,state)=>{
                    //state Value Will Determine Password Matched Or Not 
                    if(state)
                    {   
                        loginPayload ={
                            user:{
                                id:result[0].id,
                                name:result[0].name,
                            }  
                          };
                          jwt.sign(loginPayload,config.get('jwtSecret'),{
                              expiresIn:3600
                          },(err,token)=>{

                            if(!token)
                            {
                            return    res.status(401).json({msg:'UnAuthorized Access'})
                            }
                            return res.status(200).json({'token':token})
                          })
                        
                    }
                    else{
                        res.status(401).json({msg:'Username Or Password Is Incorrect'})
                         }
                })
            }
        }
    })
})
//GET ROUTE 

router.get('/',(req,res)=>{
    res.send("You Just Did Get Request")
})

module.exports=router