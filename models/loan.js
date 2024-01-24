const mongoose=require('mongoose')
const {Schema}=mongoose

const loanSchema=new Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    book_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category',
        required:true
    },
    check_out_date:{
        type:Date,
    },
    due_date:{
        type:Date
    },
    check_in_date:{
        type:Date
    }
})

module.exports=mongoose.model('loan',loanSchema)