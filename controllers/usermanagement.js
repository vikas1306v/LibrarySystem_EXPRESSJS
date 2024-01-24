const express=require('express')
const router=express.Router()
const User=require('../models/user')
const Loan=require('../models/loan')
const Book=require('../models/book')
const fetchuser=require('../middlewares/fetchuser.js')

//search a user by roll no and its loans (Login Required)(it should be accessible to admin )
router.get("/search/:roll_no",fetchuser,async(req,res)=>{
    try{
        if(req.user_role!=="admin_user")
        {
            return res.status(400).json({
                success:false,
                message:"Unauthorized"
            })
        }
        let user=await User.findOne({roll_no:req.params.roll_no})
        let loans=await Loan.find({user_id:user.id})
        res.status(200).json({
            success:true,
            data:{
                user:user,
                loans:loans
            }
        })
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
          });
    }
})




module.exports=router;
