const mongoose =require('mongoose')
const {Schema}=mongoose
const categorySchema=new Schema({
    category_title:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('category',categorySchema)