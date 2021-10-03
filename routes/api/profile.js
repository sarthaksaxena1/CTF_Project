const express= require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require( '../../models/Profile');
const User = require( '../../models/Profile');
const { check, validationResult } = require('express-validator'); //Importing For Backend Validation Check 

// @route GET api/profile/me
// @desc Get current users profile 
// @acess Private
router.get('/me',auth, async (req,res)=>{
try{
    let profile =   await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);
    if(!profile)
    {
        return res.status(400).json({msg:'There is no profile for this user'});
    }
    res.json(profile);
    }
    catch(err)
    { 
        console.log(err)
    }
})

// @route POST api/profile/
// @desc POST current users profile
// @acess Private

router.post('/',[auth,[
    check('status','Status Is Required').not().isEmpty(),
    check('bio','Bio Is Required').not().isEmpty(),
]],async (req,res)=>{
    const profileError = validationResult(req);
    if(!profileError.isEmpty())
    {
        res.status(400).json({error:profileError.array()})
    }
    const {
        user,
        status,
        company,
        website,
        location,
        bio,
        githubusername,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    }= req.body
    //If Block For Checking & Creating Final Updation Or Creation Object 

    let profileData = {social:{},"user":req.user.id};
    
  //setting user key to value of User object _id
    if(bio) profileData.bio = bio; //Bio Required 
    if(website) profileData.website = website; //Website 
    if(company) profileData.company =company;
    if(location) profileData.location = location;
    if(githubusername) profileData.githubusername=githubusername;
    if(status) profileData.status=status;

    //Social Object Into profile
    if(youtube) profileData.social.youtube = youtube ;
    if(facebook) profileData.social.facebook = facebook;
    if(linkedin) profileData.social.linkedin = linkedin;
    if(instagram) profileData.social.instagram = instagram;

    // console.log(profileData) Checking Recevied Data After Modifying Data In It

    //Update Profile If It Exists 
     
    let profile = await Profile.findOne({user:req.user.id})
    
    if(profile)
    {
       //If Profile Found Then Do This 
      profile= await Profile.findOneAndUpdate(
        {user:req.user.id},
        {$set:profileData},
        {new:true});
        
       return  res.status(200).json({updated:profileData})
    }
   
      
    //Create Profile If Not There 
    try{

    const profile = new Profile(profileData);
    await profile.save()
   return  res.status(200).json({created:profileData})

    }
    catch(err)
    {
       return  res.status(400).json({msg:"Error Occured  Creating Updating Your Profile"})
    }

    


})

// @route GET api/profile/
// @desc GET all users profile
// @acess Public

router.get('/',async (req,res)=>{
    try{

        let profiles = await Profile.find().populate('user',['name'])
        res.json(profiles)
    }
    catch(err)
    {

    }
})

// @route GET api/profile/user/:user_id
// @desc GET profile by user ID
// @acess Public 

router.get('/user/:user_id',async (req,res)=>{
    try{

        let profiles = await Profile.findOne({user:req.params.user_id}).populate('user',['name'])
       if(!profiles) return res.status(400).json({msg:'There is no profile for this user'})
       return  res.json(profiles)
    }
    catch(err)
    {
        return res.status(400).json({msg:'No Profile Found'})
    }
})

// @route DELETE  api/profile/user/:user_id
// @desc Delete profile by user ID
// @acess Private 

router.delete('/',auth,async (req,res)=>{
    try{
        //@todo - remove something else 

      //Remove Profile 
        await Profile.findOneAndRemove({user:req.user.id});
      //Remove User 
      console.log(req.user.id)
        await User.findOneAndRemove(req.user.id,(err,doc)=>{
            console.log("Error",err)
            console.log("Doc",doc)
        })
       return  res.status(200).json({msg:"User deleted"});
    }
    catch(err)
    { 
        console.log(err)
        return res.status(500).json({msg:'Server Error'})
    }
})


module.exports=router