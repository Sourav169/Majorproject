const jwt=require("jsonwebtoken")

const auth=(req,res,next)=>{
    try{
    const token=req.header("x-auth-token");
    if(!token){
        return res.status(401).json({msh:"auth denied"});
    }
    const verify=jwt.verify(token,process.env.TOKEN);
    if(!verify){
        return res.status(401).json({msh:"auth denied"});
    }
    req.user=verify.id;
    next()
}catch(error){
res.status(500).json({error:error.message});

}

}
module.exports=auth