const Category=require('../models/category');
const express=require('express');
const router=express.Router();
const fetchuser=require('../middlewares/fetchuser.js');

//Route to create a category(Login required and only admin can create)
router.post("/create",fetchuser,async (req,res)=>{
    
    try{
        const {category_title}=req.body;
        const {user_role}=req;
        if(user_role!="admin_user")
        {
            return res.status(401).json({
                success:false,
                error:"Unauthorized"
            })
        }
        const category=await Category.create({
            category_title:category_title
        })
        res.status(200).json({
            success:true,
            category:category
        })
     
    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            error:"Internal Server Error"
        })

    }
})


//get all categories(Login required and only admin can get)

router.get("/all",fetchuser,async (req,res)=>{
    try{
                const {user_role}=req;
                if(user_role!="admin_user")
                {
                    return res.status(401).json({
                        success:false,
                        error:"Unauthorized"
                    })
                }
                const category=await Category.find({})
                res.status(200).json({
                    success:true,
                    category:category
                })
    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            error:"Internal Server Error"
        })
    }
})








module.exports=router;