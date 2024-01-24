const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const JWT_SECRET = "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fetchuser = require("../middlewares/fetchuser.js");
const Loan=require('../models/loan.js')

//Route to create  A user(Login Doesnt required)
router.post("/create", async (req, res) => 
{

 try {
    let {roll_no,name,password,email,role,phone_no} =req.body;
    
    let user=await User.findOne({
       $or:[{roll_no:roll_no},{email:email}]
    }) 
    if(user)
    {
        return res.json({
            success:false,
            error:"User Already Exists"
        })
    }
    if(role==""||role==undefined)
    {
        role="student_role"
    }
    const salt = bcrypt.genSaltSync(10);
    const encPass=await bcrypt.hash(password,salt)
    user=await User.create({
        name:name,
        password:encPass,
        roll_no:roll_no,
        role:role,
        email:email,
        phone_no:phone_no
    })
    const Token=jwt.sign({user_id:user.id,user_role:role},JWT_SECRET,{
        expiresIn: "24h",
      });

    res.status(200).json({
        success:true,
        token:Token
    })
    
 } catch (error) {
    return res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    
 }


});

//Route to login a user
router.post("/login", async (req, res) =>{
    let {email,password,roll_no}=req.body
    try{
          let user=await User.findOne({
            $or:[{email:email},{roll_no:roll_no}]
          })
          if(!user)
          {
                return res.json({
                    success:false,
                    error:"Invalid Credentials"
                })
          }
            let match=await bcrypt.compare(password,user.password)
            if(!match)
            {
                return res.json({
                    success:false,
                    error:"Invalid Credentials"
                })
            }
          const Token=  jwt.sign({user_id:user.id,user_role:user.role},JWT_SECRET,{
                expiresIn: "24h",
            })
            res.status(200).json({
                success:true,
                user_role:user.role,
                token:Token
            })
          
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
          });

    }

});

//router to get all users (Admin Role Required)(Login Required) //but not return admin
router.get("/allUser", fetchuser,async (req, res) => {
    const {user_role}=req;
    if(user_role!="admin_user")
    {
        return res.status(401).json({
            success:false,
            error:"Not Authorized"
        })
    }
    try{
        let users=await User.find({role:{$in:["student_role","librarian_role"]}}).select({password:0})
        res.status(200).json({
            success:true,
            data:users
        })
    }catch(error)
    {
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
          });
    }

});



//route to delete a user (Login Required)

module.exports = router;

