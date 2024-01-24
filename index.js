const express=require('express')
const app=express()
const cors = require('cors');
const PORT=process.env.PORT || 4000
const connectToMongoDb =require('./db/conn.js')
connectToMongoDb()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded());



app.use('/api/auth',require('./controllers/auth.js'))
app.use('/api/category',require('./controllers/category.js'))
app.use('/api/book',require('./controllers/book.js'))
app.use('/api/loan',require('./controllers/loan.js'))
app.use('/api/user',require('./controllers/usermanagement.js'))



app.listen(PORT,()=>{
    console.log('Server is up on port '+PORT)
})
