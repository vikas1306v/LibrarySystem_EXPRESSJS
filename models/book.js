const mongoose=require('mongoose')
const {Schema}=mongoose
const bookSchema=new Schema({
    category_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category',
        required:true
    },
    book_title:{
        type:String,
        required:true
    },
    book_author:{
        type:String,
        required:true
    },
    book_quantity:{
        type:Number,
        required:true
    },
    available:{ 
        type:Number,
        required:true
    },
    book_img_url:{
        type:String,
        required:true
    }
})
module.exports=mongoose.model('book',bookSchema)