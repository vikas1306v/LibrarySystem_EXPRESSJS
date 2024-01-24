const mongoose =require('mongoose')
const connectToMongoDb=  ()=>{
    mongoose.connect('mongodb://localhost:27017/librarymanagement').then(()=>{
     
        console.log('connected to mongodb')
    }).catch((error)=>{
        console.log(error)
    })
}

module.exports=connectToMongoDb;