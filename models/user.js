const mongoose =require('mongoose')
const {Schema}=mongoose
const userSchema=new Schema({

    roll_no:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
       type:String,
       required:true
    },
    role:{
        type:String,
        default:'user'
    },
    phone_no:{
        type:String,
        default:""
    },
    
    fine:{
          type:String,
          default:"0"
    }
})
module.exports=mongoose.model('user',userSchema)