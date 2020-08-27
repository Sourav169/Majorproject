const router=require('express').Router();
const User=require('../model/usermodel')
const bcrypt=require("bcrypt")
const jwt=require('jsonwebtoken')
const auth=require('../middleware/auth')

router.post('/register',async(req,res)=>{
try{
     const {name,email,password,cpassword}=req.body;
     if(!email||!password||!cpassword){
            return res.status(400).json({msg:"fill all the field"})
     }
     if(password.length<5){
       return res.status(400).json({msg:"password atleast 5 char long"})
     }
     if(password!==cpassword){
       return res.status(400).json({msg:"password should be same"})
     }
     const existUser=await User .findOne({email:email})
     if(existUser){
       return res.status(400).json({msg:"account allready exist"})
     }
     const salt=await bcrypt.genSalt();
     const hashpassword=await bcrypt.hash(password,salt);
     //console.log(hashpassword)
     const newuser=new User({
            name,
            email,
            password:hashpassword,
     })
     const savedduser=await newuser.save()
     res.json(savedduser);


     
}catch(err){
       res.status(500).json(err);
}

}
);
router.post('/login', async(req,res)=>{
try{
       const {email,password}=req.body;
       if(!email||!password){
              return res.status(400).json({msg:"fill all the field"})
       }
       const user=await User.findOne({email:email})
       if(!user){
              
              return res.status(400).json({msg:"no user with this email"});
       
       }
       const match=await bcrypt.compare(password,user.password);
       if(!match){
              return res.status(400).json({msg:"password or email incorrect"});      
       }
       const token=jwt.sign({id:user._id},process.env.TOKEN);
       res.json({
              token,
              name:user.name,
             
              id:user._id,
       })


}catch(err){
       res.status(500).json(err)
}       

})
router.post('/token',async(req,res)=>{
       try{
              const token=req.header("x-auth-token");
              if(!token){
                  return res.json(false);
              }
              const verified=jwt.verify(token,process.env.TOKEN);
              
              if(!verified){
                     return res.json(false);
              }
              const user=await User.findById(verified.id);
              if(!user){
                     return res.json(false);
              }else{
              return res.json(true)
              }
          }catch(error){
          res.status(500).json({error:error.message});
          
          }
})
router.get('/',auth,async(req,res)=>{
       const user=await User.findById(req.user);
       res.json({
              token:user.token,
              id:user.id,
              name:user.name,
       })
})

module.exports=router;