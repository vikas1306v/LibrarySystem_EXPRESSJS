const express=require('express')
const router=express.Router()
const Loan=require('../models/loan')
const User=require('../models/user')
const Book=require('../models/book')
const fetchuser=require('../middlewares/fetchuser.js')


//give a book to user (only admin can give)
router.post("/create/:book_id/:roll_no",fetchuser,async(req,res)=>{
    try{
        if(req.user_role!=="admin_user")
        {
            return res.status(400).json({
                success:false,
                message:"Unauthorized"
            })
        }
        //check whether this book is already given to user or not
        let user=await User.findOne({roll_no:req.params.roll_no})

        let loan=await Loan.find({$and :[{user_id:user,id},{book_id:req.params.book_id}]}) 
        if(loan.length>0)
        {
            return res.status(400).json({
                success:false,
                message:"Book already given to user"
            })
        }
       
        let book=await Book.findById({_id:req.params.book_id})   
        if(book.available>0)
        {
            let loan=await Loan.create({
                user_id:user.id,
                book_id:req.params.book_id,
                check_out_date:Date.now(),
                due_date:Date.now()+30*24*60*60*1000
            })
         
           book= await Book.findByIdAndUpdate(req.params.book_id,{
                available:book.available-1
            })
            return res.status(200).json({
                success:true,
                message:"Book given to user"
            })

        }
        else{
            return res.status(400).json({
                success:false,
                message:"Out of stock"
            })
        }

    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
});
//update loan information (extend due date)
router.put("/update/:roll_no/:book_id",fetchuser,async(req,res)=>{
    try{
        if(req.user_role!=="admin_user")
        {
            return res.status(400).json({
                success:false,
                message:"Unauthorized"
            })
        }
        let user=await User.find({roll_no:req.params.roll_no})
        let oldloan=await Loan.find({$and :[{user_id:user[0].id},{book_id:req.params.book_id}]})
        let loan=await Loan.findOneAndUpdate({$and :[{user_id:user[0].id},{book_id:req.params.book_id}]},{
            $set:{
                due_date:oldloan[0].due_date+ 30*24*60*60*1000
            }
        })
        
        return res.status(200).json({
            success:true,
            message:"Loan updated"
        })
    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}
)


//all the loans of a user (Login Required)
router.get('/allLoans',fetchuser,async(req,res)=>{
    try{
        const loan=await Loan.find({user_id:req.user_id})
        res.status(200).json({
            success:true,
            data:loan
        })

    }catch(err)
    {
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
})

//all the loans belong to loan database
router.get("/allActiveLoans",fetchuser,async(req,res)=>{
    try {
        if(req.user_role!='admin_user')
        {
            return res.status(400).json({
                success:false,
                message:"Forbidden"
            })
        }
        const loan=await Loan.find({})
        res.status(200).json({
            success:true,
            loan:loan
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
        
    }
})

//delete a loan (or borrow user book)
router.delete("/delete/:roll_no/:book_id",fetchuser,async(req,res)=>{

    try{
        if(req.user_role!='admin_user')
        {
            return res.status(400).json({
                success:false,
                message:"Forbidden"
            })
        }
        const user=await User.find({roll_no:req.params.roll_no})
        const loan=await Loan.findOneAndDelete({$and:[{user_id:user[0].id},{book_id:req.params.book_id}]})
        res.status(200).json({
            success:true,
            loan:loan
        })

    }catch(err)
    {
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })

    }

})
module.exports=router