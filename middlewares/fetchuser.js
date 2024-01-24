const jwt=require('jsonwebtoken')
const JWT_SECRET ="SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
const fetchuser=(req,res,next)=>{
    const token =req.header('auth-token')
    if(!token)
    {
        return res.status(404).json({error:'Token Doesn\'t send'})
    }
    try{
        const decoded=jwt.verify(token,JWT_SECRET)
        req.user_id=decoded.user_id;
        req.user_role=decoded.user_role;
        next();
    }
    catch(error)
    {
        res.status(500).json({
            success:false,
            error:'Internal Server Error'
        })
    }
}
module.exports=fetchuser