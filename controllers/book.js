const express=require('express')
const router=express.Router()
const fetchuser=require('../middlewares/fetchuser')
const Book=require("../models/book");


//router for creating a book(login required)(but he has to be admin)
router.post("/create/:category_id",fetchuser,async (req,res)=>{
    const{user_role}=req
    if(user_role!="admin_user")
    {
        return res.json({
            success:false,
            error:"Unathorized"
        })
    }
    try{
       const {book_title,book_author,book_quantity,book_img_url,available}=req.body;
       let {category_id}=req.params
       const book=await Book.create({
        book_title:book_title,
        book_author:book_author,
        book_quantity:book_quantity,
        category_id:category_id,
        book_img_url:book_img_url,
        available:available
       })
       res.status(200).json({
        success:true,
        book:book
       })


    }catch(error)
    {
        return res.status(500).json({
            success:false,
            error:error
        })
    }
})


//router to get all the books(it sholud be admin and logged in)
router.get("/getAllBooks",fetchuser,async (req,res)=>{
    let {user_role}=req
    if(user_role!='admin_user')
    {
        return res.json({
            status:false,
            error:"unauthorized"
        })
    }
    try{
        const book=await Book.find({})
        res.status(200).json({
            success:true,
            book:book
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            error:"Internal Server Error"
        })

    }

});

//find all the boooks of particular category (loggin required)
router.get("/getAll/:category_id",fetchuser,async (req,res)=>{
   const  {user_role}=req;
   if(user_role!="student_role")
   {
    return res.json({
        status:false,
        error:'Unauthorized'
    })
   }
    try{
        let category_id=req.params.category_id
        const book=await Book.find({
            category_id:category_id
        })
        res.status(200).json({
            success:true,
            book:book
        })
    }catch(err)
    {
    return res.status(500).json({
        success:false,
        error:"Internal Server Error"
    })
    }
})
//get book with partcular book id
router.get('/getById/:book_id',fetchuser,async (req,res)=>{
    try{
        let book=await Book.findOne({_id:req.params.book_id})
        res.status(200).json({
            success:true,
            book:book
        })

    }catch(err)
    {
        return res.status(500).json({
            success:false,
            error:"Internal Server Error"
        })
    }
})
//delete a book by its id
router.delete("/deleteById/:book_id",fetchuser,async (req,res)=>{
    try{
        if(req.user_role!='admin_user')
        {
            return res.json({
                success:false,
                error:'unauthorized'
            })
        }
        const book=await  Book.deleteOne({_id:req.params.book_id});
        res.status(200).json({
            success:true,
            book:book

        })

    }catch(error)
    {
        return res.status(500).json({
            success:false,
            error:"Internal Server Error"
        })
    }
})


module.exports=router